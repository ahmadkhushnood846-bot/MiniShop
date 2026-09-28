import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderId =
      "MS-" + Math.floor(100000 + Math.random() * 900000);

    setCart([]);

    navigate("/order-success", {
      state: {
        orderId: orderId,
      },
    });
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* Checkout Form */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <h2>Customer Information</h2>

          <div className="form-group">
            <label htmlFor="firstName">
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
            />

            {errors.firstName && (
              <p className="form-error">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
            />

            {errors.lastName && (
              <p className="form-error">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="form-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <p className="form-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Address
            </label>

            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />

            {errors.address && (
              <p className="form-error">
                {errors.address}
              </p>
            )}
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
              />

              {errors.city && (
                <p className="form-error">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">
                Postal Code
              </label>

              <input
                id="postalCode"
                type="text"
                name="postalCode"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={handleChange}
              />

              {errors.postalCode && (
                <p className="form-error">
                  {errors.postalCode}
                </p>
              )}
            </div>

          </div>

          <button
            className="place-order-btn"
            type="submit"
          >
            Place Order
          </button>

        </form>


        {/* Order Summary */}

        <div className="checkout-summary">

          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              className="checkout-summary-item"
              key={item.id}
            >

              <div className="summary-product">

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    Qty: {item.quantity}
                  </p>
                </div>

              </div>

              <strong>
                ${(item.price * item.quantity).toFixed(2)}
              </strong>

            </div>
          ))}

          <div className="checkout-summary-total">

            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;