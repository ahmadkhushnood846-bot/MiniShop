import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            MiniShop
          </Link>

          <p>
            Quality products at simple and affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        {/* Customer */}
        <div className="footer-column">
          <h3>Customer</h3>

          <Link to="/products">Shop Now</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>Email: support@minishop.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 MiniShop. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;