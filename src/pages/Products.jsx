import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
  getProducts,
  getCategories,
} from "../api/api";

import "./Products.css";


function Products() {

  const [searchParams] =
    useSearchParams();


  /* =====================================================
     PRODUCTS STATE
  ===================================================== */

  const [products, setProducts] =
    useState([]);


  /* =====================================================
     CATEGORIES STATE
  ===================================================== */

  const [categories, setCategories] =
    useState([]);


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
     SEARCH STATE
  ===================================================== */

  const [searchTerm, setSearchTerm] =
    useState("");


  /* =====================================================
     CATEGORY STATE
  ===================================================== */

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || "All"
    );


  /* =====================================================
     SORT STATE
  ===================================================== */

  const [sortOption, setSortOption] =
    useState("default");


  /* =====================================================
     FETCH PRODUCTS + CATEGORIES
  ===================================================== */

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        setError("");


        const [
          productsData,
          categoriesData,
        ] = await Promise.all([

          getProducts(),

          getCategories(),

        ]);


        /* =========================
           PRODUCTS
        ========================= */

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );


        /* =========================
           CATEGORIES
        ========================= */

        const categoryNames =
          Array.isArray(categoriesData)

            ? categoriesData
                .map((category) => {

                  /*
                    API returns:
                    {
                      id,
                      name
                    }
                  */

                  if (
                    typeof category ===
                    "string"
                  ) {

                    return category;

                  }

                  return category.name;

                })
                .filter(Boolean)

            : [];


        setCategories(
          categoryNames
        );


      } catch (err) {

        console.error(
          "Products page error:",
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


    fetchData();

  }, []);


  /* =====================================================
     CATEGORY OPTIONS
  ===================================================== */

  const categoryOptions = [
    "All",
    ...categories,
  ];


  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = products

    .filter((product) => {

      /* =========================
         SEARCH
      ========================= */

      const productName =
        String(
          product.name || ""
        );


      const matchesSearch =
        productName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );


      /* =========================
         CATEGORY
      ========================= */

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;


      /* =========================
         STATUS
      ========================= */

      const isActive =
        product.status !==
        "Inactive";


      return (
        matchesSearch &&
        matchesCategory &&
        isActive
      );

    })


    /* =================================================
       SORT PRODUCTS
    ================================================= */

    .sort((a, b) => {

      if (
        sortOption ===
        "price-low"
      ) {

        return (
          Number(a.price) -
          Number(b.price)
        );

      }


      if (
        sortOption ===
        "price-high"
      ) {

        return (
          Number(b.price) -
          Number(a.price)
        );

      }


      if (
        sortOption ===
        "rating-high"
      ) {

        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );

      }


      if (
        sortOption ===
        "name-az"
      ) {

        return String(
          a.name || ""
        ).localeCompare(
          String(b.name || "")
        );

      }


      return 0;

    });


  /* =====================================================
     LOADING UI
  ===================================================== */

  if (loading) {

    return (

      <div className="products-page">

        <h1>
          All Products
        </h1>


        <div className="products-loading">

          <h2>
            Loading Products...
          </h2>


          <p>
            Please wait while we load
            the latest products.
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR UI
  ===================================================== */

  if (error) {

    return (

      <div className="products-page">

        <h1>
          All Products
        </h1>


        <div className="products-error">

          <h2>
            Something Went Wrong
          </h2>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =====================================================
     PRODUCTS UI
  ===================================================== */

  return (

    <div className="products-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <h1>
        All Products
      </h1>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="products-filters">


        {/* =========================
            SEARCH
        ========================= */}

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


        {/* =========================
            CATEGORY
        ========================= */}

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
        >

          {categoryOptions.map(
            (category) => (

              <option
                key={category}
                value={category}
              >
                {category}
              </option>

            )
          )}

        </select>


        {/* =========================
            SORT
        ========================= */}

        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value
            )
          }
        >

          <option value="default">
            Sort Products
          </option>


          <option value="price-low">
            Price: Low To High
          </option>


          <option value="price-high">
            Price: High To Low
          </option>


          <option value="rating-high">
            Rating: High To Low
          </option>


          <option value="name-az">
            Name: A To Z
          </option>

        </select>

      </div>


      {/* =================================================
          PRODUCT COUNT
      ================================================= */}

      <div className="products-result-count">

        {filteredProducts.length}

        {" "}

        product
        {filteredProducts.length !== 1
          ? "s"
          : ""}

      </div>


      {/* =================================================
          NO PRODUCTS
      ================================================= */}

      {filteredProducts.length === 0 ? (

        <div className="no-products">

          <h2>
            No Products Found
          </h2>


          <p>
            Try a different search
            or category.
          </p>

        </div>

      ) : (


        /* =================================================
           PRODUCT GRID
        ================================================= */

        <div className="product-grid">

          {filteredProducts.map(
            (product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            )
          )}

        </div>

      )}

    </div>

  );

}


export default Products;