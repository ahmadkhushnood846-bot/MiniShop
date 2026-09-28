import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId || "MS-123456";

  return (
    <div className="order-success-page">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for your order.
        </p>

        <p className="order-id">
          Your Order ID:
          <strong> #{orderId}</strong>
        </p>

        <p className="processing-message">
          Your order has been received and is being processed.
        </p>

        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>

      </div>
    </div>
  );
}

export default OrderSuccess;