import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProducts,
  deleteProduct as deleteProductAPI,
} from "../api/api";

import "./AdminProducts.css";


function AdminProducts() {

  /* =====================================================
     PRODUCTS STATE
  ===================================================== */

  const [products, setProducts] =
    useState([]);


  /* =====================================================
     SEARCH STATE
  ===================================================== */

  const [searchTerm, setSearchTerm] =
    useState("");


  /* =====================================================
     LOADING STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     ERROR STATE
  ===================================================== */

  const [error, setError] =
    useState("");


  /* =====================================================
     DELETING STATE
  ===================================================== */

  const [deletingId, setDeletingId] =
    useState(null);


  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getProducts();


      setProducts(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.error(
        "Admin products error:",
        err
      );


      setError(
        err.message ||
        "Unable to load products."
      );


    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     FETCH PRODUCTS ON PAGE LOAD
  ===================================================== */

  useEffect(() => {

    loadProducts();

  }, []);


  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    products.filter((product) => {

      const name =
        String(
          product.name || ""
        );


      return name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    });


  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      setError("");


      /* =========================
         DELETE FROM API
      ========================= */

      await deleteProductAPI(id);


      /* =========================
         UPDATE LOCAL PAGE STATE
      ========================= */

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product.id !== id
          )
      );


      alert(
        "Product deleted successfully."
      );


    } catch (err) {

      console.error(
        "Delete product error:",
        err
      );


      setError(
        err.message ||
        "Unable to delete product."
      );


    } finally {

      setDeletingId(null);

    }

  };


  /* =====================================================
     LOADING UI
  ===================================================== */

  if (loading) {

    return (

      <div className="admin-products">

        <div className="admin-products-header">

          <div>

            <h1>
              Products
            </h1>

            <p>
              Manage your MiniShop products.
            </p>

          </div>

        </div>


        <div className="admin-empty">

          <h2>
            Loading Products...
          </h2>

          <p>
            Please wait while we load
            your products.
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR UI
  ===================================================== */

  if (error && products.length === 0) {

    return (

      <div className="admin-products">

        <div className="admin-products-header">

          <div>

            <h1>
              Products
            </h1>

            <p>
              Manage your MiniShop products.
            </p>

          </div>


          <div className="admin-header-actions">

            <Link
              to="/admin"
              className="back-admin-btn"
            >
              Back To Dashboard
            </Link>


            <Link
              to="/admin/products/create"
              className="add-product-btn"
            >
              + Add Product
            </Link>

          </div>

        </div>


        <div className="admin-empty">

          <h2>
            Unable To Load Products
          </h2>

          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={loadProducts}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <div className="admin-products">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-products-header">


        <div>

          <h1>
            Products
          </h1>


          <p>
            Manage your MiniShop products.
          </p>

        </div>


        <div className="admin-header-actions">


          <Link
            to="/admin"
            className="back-admin-btn"
          >
            Back To Dashboard
          </Link>


          <Link
            to="/admin/products/create"
            className="add-product-btn"
          >
            + Add Product
          </Link>

        </div>

      </div>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="admin-products-error">

          {error}

        </div>

      )}


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="products-toolbar">

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />

      </div>


      {/* =================================================
          PRODUCT COUNT
      ================================================= */}

      <div className="admin-products-count">

        {filteredProducts.length} product
        {filteredProducts.length !== 1
          ? "s"
          : ""}

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredProducts.length === 0 ? (

        <div className="admin-empty">

          <h2>
            No Products Found
          </h2>


          <p>
            {searchTerm
              ? "Try a different product name."
              : "No products are available yet."}
          </p>

        </div>

      ) : (


        /* =================================================
           PRODUCTS TABLE
        ================================================= */

        <div className="admin-products-table-wrapper">

          <table className="admin-products-table">


            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>

              <tr>

                <th>
                  Image
                </th>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>

              {filteredProducts.map(
                (product) => (

                  <tr
                    key={product.id}
                  >


                    {/* =========================
                        IMAGE
                    ========================= */}

                    <td
                      data-label="Image"
                    >

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="admin-product-image"
                        onError={(
                          event
                        ) => {

                          event.currentTarget.src =
                            "https://via.placeholder.com/80x80?text=Product";

                        }}
                      />

                    </td>


                    {/* =========================
                        PRODUCT
                    ========================= */}

                    <td
                      data-label="Product"
                    >

                      <strong>
                        {product.name}
                      </strong>

                    </td>


                    {/* =========================
                        CATEGORY
                    ========================= */}

                    <td
                      data-label="Category"
                    >

                      {product.category ||
                        "N/A"}

                    </td>


                    {/* =========================
                        PRICE
                    ========================= */}

                    <td
                      data-label="Price"
                    >

                      $
                      {Number(
                        product.price || 0
                      ).toFixed(2)}

                    </td>


                    {/* =========================
                        STOCK
                    ========================= */}

                    <td
                      data-label="Stock"
                    >

                      {product.stock !==
                      undefined
                        ? product.stock
                        : "N/A"}

                    </td>


                    {/* =========================
                        STATUS
                    ========================= */}

                    <td
                      data-label="Status"
                    >

                      <span
                        className={
                          product.status ===
                          "Inactive"
                            ? "status-badge inactive"
                            : "status-badge"
                        }
                      >

                        {product.status ||
                          "Active"}

                      </span>

                    </td>


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <td
                      data-label="Actions"
                    >

                      <div className="product-actions">


                        {/* VIEW */}

                        <Link
                          to={`/product/${product.id}`}
                          className="view-product-btn"
                        >
                          View
                        </Link>


                        {/* EDIT */}

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="edit-product-btn"
                        >
                          Edit
                        </Link>


                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-product-btn"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                        >

                          {deletingId ===
                          product.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}


export default AdminProducts;