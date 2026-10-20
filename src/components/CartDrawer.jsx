import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./CartDrawer.css";

function CartDrawer({ isOpen, onClose }) {

  const { cart, setCart } = useContext(CartContext);


  /* =========================
     LOCK BODY SCROLL
  ========================= */

  useEffect(() => {

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [isOpen]);


  /* =========================
     INCREASE QUANTITY
  ========================= */

  const increaseQuantity = (id) => {

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };


  /* =========================
     DECREASE QUANTITY
  ========================= */

  const decreaseQuantity = (id) => {

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  /* =========================
     REMOVE PRODUCT
  ========================= */

  const removeItem = (id) => {

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );

  };


  /* =========================
     SUBTOTAL
  ========================= */

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );


  /* =========================
     DRAWER
  ========================= */

  const drawer = (

    <>

      {/* Overlay */}

      {isOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={onClose}
        />
      )}


      {/* Drawer */}

      <aside
        className={`cart-drawer ${
          isOpen ? "cart-drawer-open" : ""
        }`}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="cart-drawer-header">

          <h2>
            Your Cart
          </h2>

          <button
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="cart-drawer-content">

          {cart.length === 0 ? (

            <div className="cart-drawer-empty">

              <h3>
                Your Cart Is Empty
              </h3>

              <p>
                Add some products to your cart.
              </p>

              <Link
                to="/products"
                onClick={onClose}
                className="cart-shop-btn"
              >
                Shop Products
              </Link>

            </div>

          ) : (

            <div className="cart-drawer-items">

              {cart.map((item) => (

                <div
                  className="cart-drawer-item"
                  key={item.id}
                >

                  {/* Product Image */}

                  <img
                    src={item.image}
                    alt={item.name}
                  />


                  {/* Product Information */}

                  <div className="cart-drawer-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p className="cart-drawer-price">
                      ${Number(item.price).toFixed(2)}
                    </p>


                    {/* Quantity */}

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                    </div>


                    {/* Remove */}

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>


                  {/* Item Total */}

                  <strong className="cart-item-total">

                    $
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}

                  </strong>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =========================
            FOOTER
        ========================= */}

        {cart.length > 0 && (

          <div className="cart-drawer-footer">

            <div className="cart-drawer-subtotal">

              <span>
                Subtotal
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>

            </div>


            <Link
              to="/cart"
              className="drawer-cart-btn"
              onClick={onClose}
            >
              View Cart
            </Link>


            <Link
              to="/checkout"
              className="drawer-checkout-btn"
              onClick={onClose}
            >
              Checkout
            </Link>

          </div>

        )}

      </aside>

    </>

  );


  /* =========================
     RENDER INTO BODY
  ========================= */

  return createPortal(
    drawer,
    document.body
  );
}


export default CartDrawer;