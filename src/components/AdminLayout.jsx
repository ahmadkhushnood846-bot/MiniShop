import { useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
     CLOSE SIDEBAR
  ========================= */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    setSidebarOpen(false);

    navigate("/login");
  };


  return (
    <div className="admin-layout">

      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        aria-label="Toggle admin menu"
        aria-expanded={sidebarOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* =========================
            LOGO
        ========================= */}

        <div className="sidebar-logo">
          MiniShop
        </div>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <Link
            to="/admin"
            onClick={closeSidebar}
          >
            Dashboard
          </Link>


          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            onClick={closeSidebar}
          >
            Products
          </Link>


          {/* CATEGORIES */}

          <Link
            to="/admin/categories"
            onClick={closeSidebar}
          >
            Categories
          </Link>


          {/* ORDERS */}

          <Link
            to="/admin/orders"
            onClick={closeSidebar}
          >
            Orders
          </Link>

        </nav>


        {/* =========================
            SIDEBAR BOTTOM
        ========================= */}

        <div className="sidebar-bottom">

          {/* VIEW STORE */}

          <Link
            to="/"
            onClick={closeSidebar}
          >
            View Store
          </Link>


          {/* LOGOUT */}

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =========================
          PAGE CONTENT
      ========================= */}

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;