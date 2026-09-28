import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          MiniShop
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Products
        </Link>

        <Link
          to="/cart"
          className="cart-link"
          onClick={() => setMenuOpen(false)}
        >
          Cart

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;