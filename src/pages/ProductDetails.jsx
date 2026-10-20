import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import { CartContext } from "../context/CartContext";

import {
  getProductById,
} from "../api/api";

import "./ProductDetails.css";


function ProductDetails() {

  const { id } = useParams();

  const { addToCart } =
    useContext(CartContext);


  /* =====================================================
     PRODUCT STATE
  ===================================================== */

  const [product, setProduct] =
    useState(null);


  /* =====================================================
     QUANTITY STATE
  ===================================================== */

  const [quantity, setQuantity] =
    useState(1);


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
     FETCH PRODUCT
  ===================================================== */

  useEffect(() => {

    const loadProduct = async () => {

      try {

        setLoading(true);

        setError("");

        setProduct(null);

        setQuantity(1);


        const data =
          await getProductById(id);


        if (!data) {

          throw new Error(
            "Product not found."
          );

        }


        setProduct(data);


      } catch (err) {

        console.error(
          "Product details error:",
          err
        );


        setError(
          err.message ||
          "Unable to load product."
        );


      } finally {

        setLoading(false);

      }

    };


    loadProduct();

  }, [id]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="product-details-section">

        <div className="product-details-loading">

          <h2>
            Loading Product...
          </h2>

          <p>
            Please wait while we load
            the product details.
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR / NOT FOUND
  ===================================================== */

  if (
    error ||
    !product ||
    product.status === "Inactive"
  ) {

    return (

      <div className="product-details-section">

        <div className="product-details-error">

          <h2>
            {product?.status === "Inactive"
              ? "Product Not Found"
              : error || "Product Not Found"}
          </h2>


          <p>
            The product you're looking
            for is unavailable.
          </p>


          <Link
            to="/products"
            className="back-products-btn"
          >
            Back To Products
          </Link>

        </div>

      </div>

    );

  }


  /* =====================================================
     STOCK
  ===================================================== */

  const stock =
    Number(product.stock) || 0;


  const isOutOfStock =
    stock <= 0;


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {

    if (isOutOfStock) {
      return;
    }


    addToCart(
      product,
      quantity
    );

  };


  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  const handleImageError = (event) => {

    event.currentTarget.src =
      "https://via.placeholder.com/600x600?text=Product";

  };


  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  return (

    <div className="product-details-section">

      <div className="product-details">


        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <div className="product-image-container">

          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
          />

        </div>


        {/* =================================================
            PRODUCT INFO
        ================================================= */}

        <div className="product-info">


          {/* PRODUCT NAME */}

          <h1>
            {product.name}
          </h1>


          {/* PRICE */}

          <p>
            <strong>
              Price:
            </strong>{" "}
            ${Number(
              product.price || 0
            ).toFixed(2)}
          </p>


          {/* CATEGORY */}

          <p>
            <strong>
              Category:
            </strong>{" "}
            {product.category || "N/A"}
          </p>


          {/* RATING */}

          <p>
            <strong>
              Rating:
            </strong>{" "}
            ⭐ {Number(
              product.rating || 0
            ).toFixed(1)}
          </p>


          {/* STOCK */}

          <p>

            <strong>
              Stock:
            </strong>{" "}

            {isOutOfStock
              ? "Out Of Stock"
              : stock}

          </p>


          {/* DESCRIPTION */}

          <p>
            {product.description ||
              "No description available."}
          </p>


          {/* =================================================
              QUANTITY
          ================================================= */}

          {!isOutOfStock && (

            <div className="quantity">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    quantity > 1
                      ? quantity - 1
                      : 1
                  )
                }
                aria-label="Decrease quantity"
              >
                -
              </button>


              <span>
                {quantity}
              </span>


              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    quantity < stock
                      ? quantity + 1
                      : quantity
                  )
                }
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

          )}


          {/* =================================================
              ADD TO CART
          ================================================= */}

          <button
            type="button"
            className="cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >

            {isOutOfStock
              ? "Out Of Stock"
              : "Add To Cart"}

          </button>


        </div>

      </div>

    </div>

  );

}


export default ProductDetails;