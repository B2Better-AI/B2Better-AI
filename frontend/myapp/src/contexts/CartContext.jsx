import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart reducer for state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      // Automatically create an order for the added item
      const newOrder = {
        id: Date.now() + Math.random(), // Unique ID
        items: [{ ...action.payload, quantity: 1 }],
        total: action.payload.price,
        date: new Date().toISOString(),
        status: 'pending',
        retailer: action.payload.retailer || 'Unknown Retailer'
      };
      
      return {
        ...state,
        items: updatedItems,
        orders: [...state.orders, newOrder]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'PLACE_ORDER':
      // This case is no longer needed since orders are created automatically
      // when items are added to cart
      return state;

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        orders: action.payload.orders || []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orders: []
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('b2better-cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      dispatch({ type: 'LOAD_CART', payload: cartData });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('b2better-cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const placeOrder = () => {
    dispatch({ type: 'PLACE_ORDER' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalBillingAmount = () => {
    return state.orders.reduce((total, order) => total + order.total, 0);
  };

  const getTotalOrdersCount = () => {
    return state.orders.length;
  };

  const value = {
    items: state.items,
    orders: state.orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    getCartTotal,
    getCartItemsCount,
    getTotalBillingAmount,
    getTotalOrdersCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
