import { useCart } from './contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, placeOrder, getTotalBillingAmount, getTotalOrdersCount } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    setIsPlacingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      placeOrder();
      setIsPlacingOrder(false);
      navigate('/orders');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-header">
          <h1>Shopping Cart</h1>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/retailers')}
          >
            Browse Retailers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Shopping Cart ({items.length} items)</h1>
          <div className="billing-summary">
            <div className="summary-item">
              <span className="label">Total Orders:</span>
              <span className="value">{getTotalOrdersCount()}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Billing:</span>
              <span className="value total-amount">${getTotalBillingAmount().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-price">${item.price}</div>
              </div>
              <div className="item-quantity">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h3>Order Summary</h3>
          </div>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
            </div>
          </div>
          <div className="checkout-actions">
            <button 
              className="checkout-btn primary"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </button>
            <button 
              className="checkout-btn secondary"
              onClick={handleViewOrders}
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
