import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import "./Navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);


  /* =========================
     CART COUNT
  ========================= */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );


  /* =========================
     CLOSE MOBILE MENU
  ========================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };


  /* =========================
     OPEN CART DRAWER
  ========================= */

  const openCartDrawer = () => {
    setMenuOpen(false);
    setCartDrawerOpen(true);
  };


  /* =========================
     CLOSE CART DRAWER
  ========================= */

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
  };


  /* =========================
     CART ICON
  ========================= */

  const CartIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="10"
        cy="20"
        r="1.2"
        fill="currentColor"
      />

      <circle
        cx="18"
        cy="20"
        r="1.2"
        fill="currentColor"
      />

    </svg>
  );


  return (
    <>
      <nav className="navbar">


        {/* =========================
            LOGO
        ========================= */}

        <div className="logo">

          <Link
            to="/"
            onClick={closeMenu}
          >
            MiniShop
          </Link>

        </div>


        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div className="nav-links">

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>


          <Link
            to="/products"
            onClick={closeMenu}
          >
            Products
          </Link>


          {/* Desktop Cart */}

          <button
            type="button"
            className="cart-link"
            onClick={openCartDrawer}
            aria-label="Open shopping cart"
          >

            <CartIcon />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </button>

        </div>


        {/* =========================
            MOBILE ACTIONS
        ========================= */}

        <div className="mobile-actions">


          {/* Mobile Cart */}

          <button
            type="button"
            className="mobile-cart"
            onClick={openCartDrawer}
            aria-label="Open shopping cart"
          >

            <CartIcon />

            {cartCount > 0 && (
              <span className="mobile-cart-count">
                {cartCount}
              </span>
            )}

          </button>


          {/* Hamburger */}

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >

            <span></span>
            <span></span>
            <span></span>

          </button>

        </div>


        {/* =========================
            MOBILE MENU
        ========================= */}

        <div
          className={`mobile-menu ${
            menuOpen ? "active" : ""
          }`}
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>


          <Link
            to="/products"
            onClick={closeMenu}
          >
            Products
          </Link>

        </div>

      </nav>


      {/* =========================
          CART DRAWER
      ========================= */}

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={closeCartDrawer}
      />

    </>
  );
}

export default Navbar;