import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";


function App() {

  return (

    <BrowserRouter basename="/MiniShop">

      <ScrollToTop />

      <Routes>

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            STORE PAGES
        ========================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
              <Footer />
            </>
          }
        />

        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
              <Footer />
            </>
          }
        />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          }
        />

        <Route
          path="/order-success"
          element={
            <>
              <Navbar />
              <OrderSuccess />
              <Footer />
            </>
          }
        />


        {/* =========================
            PROTECTED ADMIN ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* =========================
                ADMIN DASHBOARD
            ========================= */}

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* =========================
                ADMIN PRODUCTS
            ========================= */}

            <Route
              path="products"
              element={<AdminProducts />}
            />


            {/* =========================
                ADD PRODUCT
            ========================= */}

            <Route
              path="products/create"
              element={<AdminAddProduct />}
            />


            {/* =========================
                EDIT PRODUCT
            ========================= */}

            <Route
              path="products/edit/:id"
              element={<AdminEditProduct />}
            />


            {/* =========================
                ADMIN CATEGORIES
            ========================= */}

            <Route
              path="categories"
              element={<AdminCategories />}
            />


            {/* =========================
                ADMIN ORDERS
            ========================= */}

            <Route
              path="orders"
              element={<AdminOrders />}
            />


            {/* =========================
                ORDER DETAILS
            ========================= */}

            <Route
              path="orders/:id"
              element={<AdminOrderDetails />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>

  );
}


export default App;