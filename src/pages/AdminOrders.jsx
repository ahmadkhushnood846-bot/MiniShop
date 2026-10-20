import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../api/api";

import "./AdminOrders.css";


function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);


  /* =========================
     LOAD ORDERS
  ========================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      setError(
        err.message ||
        "Unable to load orders."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================
     FETCH ON PAGE LOAD
  ========================= */

  useEffect(() => {
    fetchOrders();
  }, []);


  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB");
  };


  /* =========================
     CUSTOMER NAME
  ========================= */

  const getCustomerName = (order) => {
    if (
      order.customer?.firstName ||
      order.customer?.lastName
    ) {
      return `${order.customer?.firstName || ""} ${
        order.customer?.lastName || ""
      }`.trim();
    }

    if (order.customer?.name) {
      return order.customer.name;
    }

    if (order.customerName) {
      return order.customerName;
    }

    return "N/A";
  };


  /* =========================
     CUSTOMER EMAIL
  ========================= */

  const getCustomerEmail = (order) => {
    return (
      order.customer?.email ||
      order.email ||
      "N/A"
    );
  };


  /* =========================
     FILTER ORDERS
  ========================= */

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    const orderId = String(
      order.id || ""
    ).toLowerCase();

    const customerName = getCustomerName(order)
      .toLowerCase();

    const customerEmail = getCustomerEmail(order)
      .toLowerCase();

    const matchesSearch =
      !search ||
      orderId.includes(search) ||
      customerName.includes(search) ||
      customerEmail.includes(search);

    const currentStatus =
      order.status || "Pending";

    const matchesStatus =
      statusFilter === "All" ||
      currentStatus === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });


  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const updatedOrder =
        await updateOrderStatus(
          orderId,
          newStatus
        );

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (
            String(order.id) !==
            String(orderId)
          ) {
            return order;
          }

          return updatedOrder &&
            updatedOrder.id
            ? updatedOrder
            : {
                ...order,
                status: newStatus,
              };
        })
      );

    } catch (err) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to update order status."
      );

    } finally {
      setUpdatingOrderId(null);
    }
  };


  /* =========================
     DELETE ORDER
  ========================= */

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      setError("");

      await deleteOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) =>
            String(order.id) !==
            String(orderId)
        )
      );

    } catch (err) {
      console.error(
        "DELETE ORDER ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to delete order."
      );

    } finally {
      setDeletingOrderId(null);
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-orders">

        <div className="admin-orders-header">

          <div>
            <h1>Orders</h1>

            <p>
              View and manage customer orders.
            </p>
          </div>

          <Link
            to="/admin"
            className="back-admin-btn"
          >
            Back To Dashboard
          </Link>

        </div>

        <div className="admin-orders-empty">

          <h2>
            Loading Orders...
          </h2>

          <p>
            Please wait while orders are loading.
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (
    error &&
    orders.length === 0
  ) {
    return (
      <div className="admin-orders">

        <div className="admin-orders-header">

          <div>
            <h1>Orders</h1>

            <p>
              View and manage customer orders.
            </p>
          </div>

          <Link
            to="/admin"
            className="back-admin-btn"
          >
            Back To Dashboard
          </Link>

        </div>

        <div className="admin-orders-empty">

          <h2>
            Something Went Wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="view-order-btn"
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="admin-orders">

      {/* HEADER */}

      <div className="admin-orders-header">

        <div>
          <h1>Orders</h1>

          <p>
            View and manage customer orders.
          </p>
        </div>

        <Link
          to="/admin"
          className="back-admin-btn"
        >
          Back To Dashboard
        </Link>

      </div>


      {/* ERROR MESSAGE */}

      {error && (
        <div className="admin-orders-error">
          {error}
        </div>
      )}


      {/* TOOLBAR */}

      <div className="orders-toolbar">

        <input
          type="text"
          placeholder="Search by order ID, customer or email..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Processing">
            Processing
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

      </div>


      {/* ORDER COUNT */}

      <div className="orders-result-count">

        {filteredOrders.length}{" "}

        order
        {filteredOrders.length !== 1
          ? "s"
          : ""}

      </div>


      {/* EMPTY */}

      {filteredOrders.length === 0 ? (

        <div className="admin-orders-empty">

          <h2>
            No Orders Found
          </h2>

          <p>
            {searchTerm ||
            statusFilter !== "All"
              ? "Try changing your search or filter."
              : "Customer orders will appear here after checkout."}
          </p>

        </div>

      ) : (

        /* ORDERS TABLE */

        <div className="admin-orders-table-wrapper">

          <table className="admin-orders-table">

            <thead>

              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredOrders.map((order) => {

                const currentStatus =
                  order.status || "Pending";

                const isUpdating =
                  updatingOrderId === order.id;

                const isDeleting =
                  deletingOrderId === order.id;


                return (
                  <tr key={order.id}>

                    {/* ORDER ID */}

                    <td data-label="Order ID">

                      <strong>
                        {order.id}
                      </strong>

                    </td>


                    {/* CUSTOMER */}

                    <td data-label="Customer">

                      <div className="order-customer">

                        <strong>
                          {getCustomerName(order)}
                        </strong>

                        <span>
                          {getCustomerEmail(order)}
                        </span>

                      </div>

                    </td>


                    {/* DATE */}

                    <td data-label="Date">

                      {formatDate(
                        order.createdAt ||
                        order.orderDate
                      )}

                    </td>


                    {/* ITEMS */}

                    <td data-label="Items">

                      {Array.isArray(order.items)
                        ? order.items.length
                        : 0}

                    </td>


                    {/* TOTAL */}

                    <td data-label="Total">

                      <strong>
                        $
                        {Number(
                          order.total || 0
                        ).toFixed(2)}
                      </strong>

                    </td>


                    {/* STATUS */}

                    <td data-label="Status">

                      <select
                        className={`order-status-select ${currentStatus.toLowerCase()}`}
                        value={currentStatus}
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    {/* ACTIONS */}

                    <td data-label="Actions">

                      <div className="order-actions">

                        <button
                          type="button"
                          className="view-order-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order.id}`
                            )
                          }
                          disabled={isDeleting}
                        >
                          View
                        </button>


                        <button
                          type="button"
                          className="delete-order-btn"
                          onClick={() =>
                            handleDelete(order.id)
                          }
                          disabled={
                            isDeleting ||
                            isUpdating
                          }
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


export default AdminOrders;