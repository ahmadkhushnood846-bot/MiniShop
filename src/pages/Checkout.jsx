import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { createOrder } from "../api/api";

import "./Checkout.css";


function Checkout() {

  const navigate = useNavigate();

  const { cart, setCart } =
    useContext(CartContext);


  /* =========================
     FORM DATA
  ========================= */

  const [formData, setFormData] = useState({

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    address: "",

    city: "",

    postalCode: "",

  });


  const [errors, setErrors] =
    useState({});


  const [isSubmitting, setIsSubmitting] =
    useState(false);


  /* =========================
     HANDLE INPUT CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));


    setErrors((previous) => ({

      ...previous,

      [name]: "",

    }));

  };


  /* =========================
     VALIDATE FORM
  ========================= */

  const validateForm = () => {

    const newErrors = {};


    if (!formData.firstName.trim()) {

      newErrors.firstName =
        "First name is required.";

    }


    if (!formData.lastName.trim()) {

      newErrors.lastName =
        "Last name is required.";

    }


    if (!formData.email.trim()) {

      newErrors.email =
        "Email is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {

      newErrors.email =
        "Enter a valid email.";

    }


    if (!formData.phone.trim()) {

      newErrors.phone =
        "Phone number is required.";

    }


    if (!formData.address.trim()) {

      newErrors.address =
        "Address is required.";

    }


    if (!formData.city.trim()) {

      newErrors.city =
        "City is required.";

    }


    if (!formData.postalCode.trim()) {

      newErrors.postalCode =
        "Postal code is required.";

    }


    setErrors(newErrors);


    return (
      Object.keys(newErrors).length === 0
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
     PLACE ORDER
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!validateForm()) {
      return;
    }


    if (cart.length === 0) {

      alert("Your cart is empty.");

      return;

    }


    setIsSubmitting(true);


    /* =========================
       ORDER DATA
    ========================= */

    const orderData = {

      customer: {

        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        address:
          formData.address.trim(),

        city:
          formData.city.trim(),

        postalCode:
          formData.postalCode.trim(),

      },


      items: cart.map((item) => ({

        id:
          item.id,

        name:
          item.name,

        price:
          Number(item.price),

        quantity:
          Number(item.quantity),

        image:
          item.image,

      })),


      subtotal:
        Number(subtotal.toFixed(2)),


      shippingCost:
        0,


      total:
        Number(subtotal.toFixed(2)),

    };


    try {

      /* =========================
         SEND ORDER TO API
      ========================= */

      const savedOrder =
        await createOrder(orderData);


      /* =========================
         CLEAR CART
      ========================= */

      setCart([]);


      /* =========================
         GO TO SUCCESS PAGE
      ========================= */

      navigate(
        "/order-success",
        {
          state: {
            orderId:
              savedOrder.id,
          },
        }
      );


    } catch (error) {

      console.error(
        "Order Error:",
        error
      );


      alert(
        error.message ||
        "Unable to place order. Please try again."
      );


    } finally {

      setIsSubmitting(false);

    }

  };


  return (

    <div className="checkout-page">


      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1>
        Checkout
      </h1>


      <div className="checkout-container">


        {/* =========================
            CHECKOUT FORM
        ========================= */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Customer Information
          </h2>


          {/* =========================
              FIRST NAME
          ========================= */}

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


          {/* =========================
              LAST NAME
          ========================= */}

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


          {/* =========================
              EMAIL
          ========================= */}

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


          {/* =========================
              PHONE
          ========================= */}

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


          {/* =========================
              ADDRESS
          ========================= */}

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


          {/* =========================
              CITY + POSTAL CODE
          ========================= */}

          <div className="form-row">


            {/* CITY */}

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


            {/* POSTAL CODE */}

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


          {/* =========================
              PLACE ORDER
          ========================= */}

          <button
            className="place-order-btn"
            type="submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </form>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>


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

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Qty: {item.quantity}
                  </p>

                </div>

              </div>


              <strong>

                $
                {(
                  Number(item.price) *
                  Number(item.quantity)
                ).toFixed(2)}

              </strong>

            </div>

          ))}


          {/* =========================
              TOTAL
          ========================= */}

          <div className="checkout-summary-total">

            <span>
              Subtotal
            </span>

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