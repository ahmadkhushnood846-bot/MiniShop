import { useEffect, useState } from "react";

import {
  getProducts,
  getCategories,
  getOrders,
} from "../api/api";

import "./AdminDashboard.css";


function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setError("");


        /* =========================
           PRODUCTS
        ========================= */

        const productsData =
          await getProducts();

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );


        /* =========================
           CATEGORIES
        ========================= */

        const categoriesData =
          await getCategories();

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );


        /* =========================
           ORDERS
        ========================= */

        const ordersData =
          await getOrders();

        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );


      } catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );

        setError(
          error.message ||
          "Failed to load dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  /* =========================
     STATISTICS
  ========================= */

  const totalProducts =
    products.length;


  const totalCategories =
    categories.length;


  const totalOrders =
    orders.length;


  const totalRevenue =
    orders.reduce(
      (total, order) => {

        return (
          total +
          Number(order.total || 0)
        );

      },
      0
    );


  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;


  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) === 0
    ).length;


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <main className="admin-dashboard">

        <div className="admin-header">

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Loading dashboard data...
          </p>

        </div>

      </main>
    );

  }


  /* =========================
     ERROR
  ========================= */

  if (error) {

    return (
      <main className="admin-dashboard">

        <div className="admin-header">

          <h1>
            Admin Dashboard
          </h1>

          <p className="dashboard-error">
            {error}
          </p>

        </div>

      </main>
    );

  }


  /* =========================
     DASHBOARD
  ========================= */

  return (
    <main className="admin-dashboard">


      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage your MiniShop store from one place.
        </p>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="admin-stats">


        {/* =========================
            PRODUCTS
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Total Products
          </span>

          <h2>
            {totalProducts}
          </h2>

        </div>


        {/* =========================
            CATEGORIES
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Total Categories
          </span>

          <h2>
            {totalCategories}
          </h2>

        </div>


        {/* =========================
            ORDERS
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Total Orders
          </span>

          <h2>
            {totalOrders}
          </h2>

        </div>


        {/* =========================
            REVENUE
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Total Revenue
          </span>

          <h2>
            ${totalRevenue.toFixed(2)}
          </h2>

        </div>


        {/* =========================
            PENDING ORDERS
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Pending Orders
          </span>

          <h2>
            {pendingOrders}
          </h2>

        </div>


        {/* =========================
            OUT OF STOCK
        ========================= */}

        <div className="stat-card">

          <span className="stat-label">
            Out Of Stock
          </span>

          <h2>
            {outOfStockProducts}
          </h2>

        </div>


      </div>


    </main>
  );
}


export default AdminDashboard;