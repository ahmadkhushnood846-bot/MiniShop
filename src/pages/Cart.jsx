import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, setCart } = useContext(CartContext);

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>

        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <Link className="continue-shopping-btn" to="/products">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h1>Shopping Cart</h1>

      <div className="cart-items">

        {cart.map((item) => (
          <div className="cart-item" key={item.id}>

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="cart-item-info">

              <h2>{item.name}</h2>

              <p className="cart-price">
                Price: ${item.price}
              </p>

              <div className="quantity-controls">

                <button
                  className="quantity-btn"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="quantity-btn"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>

              </div>

              <p className="cart-total">
                Total: ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                className="remove-button"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>

            </div>

          </div>
        ))}

      </div>

      <div className="cart-summary">

        <h2>
          Subtotal: ${subtotal.toFixed(2)}
        </h2>

        <div className="cart-summary-actions">

          <Link
            className="continue-shopping-btn"
            to="/products"
          >
            Continue Shopping
          </Link>

          <Link
            className="checkout-btn"
            to="/checkout"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;