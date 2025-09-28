from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import math
from pymongo import MongoClient


MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "b2better")


class Recommendation(BaseModel):
    productId: str
    title: str
    category: Optional[str] = None
    score: float
    price: Optional[float] = None
    image: Optional[str] = None


app = FastAPI(title="B2Better AI Recommendations")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    client = MongoClient(MONGODB_URI)
    return client[MONGODB_DB]


def jaccard_similarity(a: set, b: set) -> float:
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/recommendations/{retailerId}", response_model=List[Recommendation])
def get_recommendations(retailerId: str, limit: int = 6):
    db = get_db()

    orders_col = db.get_collection("orders")
    products_col = db.get_collection("products")

    # 1) Gather user's purchased product IDs and categories (content signals)
    user_orders = list(orders_col.find({"retailer": retailerId}))
    purchased_product_ids = []
    for o in user_orders:
        for item in (o.get("items") or []):
            pid = item.get("product")
            if pid:
                purchased_product_ids.append(str(pid))

    purchased_product_ids_set = set(purchased_product_ids)

    purchased_categories: set = set()
    if purchased_product_ids:
        product_docs = products_col.find({"_id": {"$in": list({p for p in purchased_product_ids})}})
        for p in product_docs:
            cat = p.get("category")
            if cat:
                purchased_categories.add(cat)

    # 2) Collaborative: find trending products among other users who bought similar categories
    trending_pipeline = [
        {"$unwind": "$items"},
        {"$lookup": {"from": "products", "localField": "items.product", "foreignField": "_id", "as": "prod"}},
        {"$unwind": "$prod"},
        {"$match": {"prod.category": {"$in": list(purchased_categories) if purchased_categories else []}}},
        {"$group": {"_id": "$items.product", "count": {"$sum": 1}, "anyProd": {"$first": "$prod"}}},
        {"$sort": {"count": -1}},
        {"$limit": max(limit * 2, 10)}
    ]

    trending: List[dict] = []
    if purchased_categories:
        trending = list(orders_col.aggregate(trending_pipeline))

    # 3) Content-based: similar products by category overlap and simple text match on title
    similar_query = {}
    if purchased_categories:
        similar_query["category"] = {"$in": list(purchased_categories)}

    similar_candidates = list(products_col.find(similar_query).limit(200)) if similar_query else []

    def content_score(prod: dict) -> float:
        score = 0.0
        # Category overlap weight
        if prod.get("category") in purchased_categories:
            score += 1.0

        # Simple title overlap heuristic
        title = (prod.get("name") or prod.get("title") or "").lower()
        keywords = set()
        for o in user_orders:
            for item in (o.get("items") or []):
                k = (item.get("name") or "").lower().split()
                for token in k:
                    if len(token) >= 4:
                        keywords.add(token)
        if keywords:
            overlap = len(set(title.split()) & keywords)
            score += min(1.0, overlap / 3.0)

        # Popularity (if rating exists)
        rating = prod.get("rating", {})
        count = rating.get("count", 0)
        score += min(1.0, math.log10(count + 1) / 2)
        return score

    cb_ranked = sorted(
        [p for p in similar_candidates if str(p.get("_id")) not in purchased_product_ids_set],
        key=content_score,
        reverse=True
    )

    # Fuse collaborative trending with content-based
    results: List[dict] = []

    # Top from content-based
    for p in cb_ranked[: limit * 2]:
        results.append({
            "productId": str(p.get("_id")),
            "title": p.get("name") or p.get("title") or "Product",
            "category": p.get("category"),
            "score": content_score(p) + 0.1,
            "price": (p.get("pricing") or {}).get("salePrice") or (p.get("pricing") or {}).get("basePrice"),
            "image": (p.get("images") or [{}])[0].get("url") if p.get("images") else None,
        })

    # Add trending collaborative picks
    for t in trending:
        prod = t.get("anyProd") or {}
        pid = str(t.get("_id")) if t.get("_id") else None
        if not pid or pid in purchased_product_ids_set:
            continue
        results.append({
            "productId": pid,
            "title": prod.get("name") or prod.get("title") or "Product",
            "category": prod.get("category"),
            "score": 0.2 + min(1.0, math.log10(t.get("count", 1) + 1)),
            "price": (prod.get("pricing") or {}).get("salePrice") or (prod.get("pricing") or {}).get("basePrice"),
            "image": (prod.get("images") or [{}])[0].get("url") if prod.get("images") else None,
        })

    # If we still have few results, just backfill with top-rated products
    if len(results) < limit:
        fallback = list(products_col.find({}).sort("rating.average", -1).limit(limit * 2))
        for p in fallback:
            pid = str(p.get("_id"))
            if pid in purchased_product_ids_set:
                continue
            results.append({
                "productId": pid,
                "title": p.get("name") or p.get("title") or "Product",
                "category": p.get("category"),
                "score": 0.1,
                "price": (p.get("pricing") or {}).get("salePrice") or (p.get("pricing") or {}).get("basePrice"),
                "image": (p.get("images") or [{}])[0].get("url") if p.get("images") else None,
            })

    # Deduplicate by productId and take top
    seen = set()
    unique: List[dict] = []
    for r in sorted(results, key=lambda x: x["score"], reverse=True):
        if r["productId"] in seen:
            continue
        seen.add(r["productId"])
        unique.append(r)
        if len(unique) >= limit:
            break

    return unique


