import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminOrderDetails.css";

const API_BASE_URL = "http://localhost:5000/api";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     GET SINGLE ORDER
  ========================= */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/orders/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setOrder(null);
            return;
          }

          throw new Error(
            "Unable to load order."
          );
        }

        const data = await response.json();

        setOrder(data);
      } catch (err) {
        console.error(
          "FETCH ORDER ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-order-details">

        <div className="order-not-found">

          <h1>
            Loading Order...
          </h1>

          <p>
            Please wait while the order is loading.
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="admin-order-details">

        <div className="order-not-found">

          <h1>
            Something Went Wrong
          </h1>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Back To Orders
          </button>

        </div>

      </div>
    );
  }


  /* =========================
     ORDER NOT FOUND
  ========================= */

  if (!order) {
    return (
      <div className="admin-order-details">

        <div className="order-not-found">

          <h1>
            Order Not Found
          </h1>

          <p>
            The order you are looking for does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Back To Orders
          </button>

        </div>

      </div>
    );
  }


  /* =========================
     ORDER TOTAL
  ========================= */

  const orderTotal =
    Number(order.total) || 0;


  /* =========================
     FORMAT DATE
  ========================= */

  const formattedDate = order.createdAt
    ? new Date(
        order.createdAt
      ).toLocaleDateString("en-GB")
    : "N/A";


  return (
    <div className="admin-order-details">

      {/* =========================
          HEADER
      ========================= */}

      <div className="order-details-header">

        <div>

          <h1>
            Order Details
          </h1>

          <p>
            View complete information about this order.
          </p>

        </div>

        <button
          className="back-orders-btn"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          Back To Orders
        </button>

      </div>


      {/* =========================
          ORDER INFORMATION
      ========================= */}

      <div className="order-info-card">

        <div className="order-info-top">

          <div>

            <span className="order-info-label">
              Order ID
            </span>

            <h2>
              {order.id}
            </h2>

          </div>


          <div>

            <span className="order-info-label">
              Order Date
            </span>

            <strong>
              {formattedDate}
            </strong>

          </div>


          <div>

            <span className="order-info-label">
              Status
            </span>

            <span
              className={`order-detail-status ${
                (
                  order.status ||
                  "Pending"
                ).toLowerCase()
              }`}
            >
              {order.status || "Pending"}
            </span>

          </div>

        </div>

      </div>


      {/* =========================
          CUSTOMER + SHIPPING
      ========================= */}

      <div className="order-details-grid">

        {/* CUSTOMER */}

        <div className="order-details-card">

          <h2>
            Customer Information
          </h2>


          <div className="customer-detail">

            <span>
              Name
            </span>

            <strong>
              {order.customer?.firstName}{" "}
              {order.customer?.lastName}
            </strong>

          </div>


          <div className="customer-detail">

            <span>
              Email
            </span>

            <strong>
              {order.customer?.email ||
                "N/A"}
            </strong>

          </div>


          <div className="customer-detail">

            <span>
              Phone
            </span>

            <strong>
              {order.customer?.phone ||
                "N/A"}
            </strong>

          </div>

        </div>


        {/* SHIPPING */}

        <div className="order-details-card">

          <h2>
            Shipping Information
          </h2>


          <div className="customer-detail">

            <span>
              Address
            </span>

            <strong>
              {order.customer?.address ||
                "N/A"}
            </strong>

          </div>


          <div className="customer-detail">

            <span>
              City
            </span>

            <strong>
              {order.customer?.city ||
                "N/A"}
            </strong>

          </div>


          <div className="customer-detail">

            <span>
              Postal Code
            </span>

            <strong>
              {order.customer?.postalCode ||
                "N/A"}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          ORDER ITEMS
      ========================= */}

      <div className="order-products-card">

        <div className="order-products-header">

          <div>

            <h2>
              Order Items
            </h2>

            <p>
              {order.items?.length || 0}{" "}
              product
              {order.items?.length === 1
                ? ""
                : "s"}
            </p>

          </div>

        </div>


        <div className="order-items-table-wrapper">

          <table className="order-items-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Price
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              {order.items?.map(
                (item) => {

                  const itemPrice =
                    Number(
                      item.price
                    ) || 0;

                  const quantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const itemTotal =
                    itemPrice *
                    quantity;

                  return (
                    <tr
                      key={item.id}
                    >

                      <td>

                        <div className="order-product">

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                      </td>


                      <td>
                        $
                        {itemPrice.toFixed(
                          2
                        )}
                      </td>


                      <td>
                        {quantity}
                      </td>


                      <td>

                        <strong>
                          $
                          {itemTotal.toFixed(
                            2
                          )}
                        </strong>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>


        {/* =========================
            TOTAL
        ========================= */}

        <div className="order-total">

          <span>
            Order Total
          </span>

          <strong>
            $
            {orderTotal.toFixed(2)}
          </strong>

        </div>

      </div>

    </div>
  );
}

export default AdminOrderDetails;