import { useCart } from './contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Orders = () => {
  const { orders, getTotalBillingAmount, getTotalOrdersCount } = useCart();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9900';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#10b981';
      case 'delivered':
        return '#059669';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="page-header">
          <h1>Your Orders</h1>
        </div>
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your orders will appear here once you place them.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/retailers')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Your Orders ({orders.length})</h1>
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
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{Math.floor(order.id)}</h3>
                <p className="order-date">{formatDate(order.date)}</p>
                {order.retailer && (
                  <p className="order-retailer">From: {order.retailer}</p>
                )}
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="order-items">
              <h4>Items ({order.items.length})</h4>
              <div className="items-list">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h5>{item.name}</h5>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${(order.total * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(order.total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="order-actions">
              <button className="btn-secondary">Track Order</button>
              <button className="btn-secondary">Reorder</button>
              <button className="btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
