import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import heroShop from "../assets/hero-shop.png.png";

function Home() {
  const { categories, products } = useContext(StoreContext);

  /* =========================
     ACTIVE CATEGORIES
  ========================= */

  const activeCategories = categories.filter(
    (category) => category.status !== "Inactive"
  );

  /* =========================
     FEATURED PRODUCTS
  ========================= */

  const featuredProducts = products
    .filter((product) => product.status !== "Inactive")
    .slice(0, 4);

  return (
    <section className="home">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-small-text">
            Welcome To MiniShop
          </span>

          <h1>
            Shop Everything
            <br />
            You Need
          </h1>

          <p>
            Discover quality products at the best prices.
            Find your favorites and shop with ease.
          </p>

          <Link
            to="/products"
            className="hero-shop-btn"
          >
            Shop Now
          </Link>

        </div>


        <div className="hero-image">

          <img
            src={heroShop}
            alt="MiniShop products"
          />

        </div>

      </section>


      {/* =========================
          CATEGORIES SECTION
      ========================= */}

      <section className="categories">

        <div className="section-heading">

          <span>
            Explore Our Store
          </span>

          <h2>
            Shop By Category
          </h2>

          <p>
            Browse our collection by category and find
            products that match what you need.
          </p>

        </div>


        <div className="category-grid">

          {activeCategories.map((category) => (

            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="category-card"
            >

              <div className="category-card-content">

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description}
                </p>

                <span className="category-link">
                  Shop Now →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =========================
          FEATURED PRODUCTS
      ========================= */}

      <section className="featured-products">

        <div className="section-heading">

          <span>
            Our Collection
          </span>

          <h2>
            Featured Products
          </h2>

          <p>
            Explore some of our popular products available
            in the MiniShop collection.
          </p>

        </div>


        {featuredProducts.length === 0 ? (

          <div className="no-featured-products">

            <h3>
              No products available
            </h3>

            <p>
              Products will appear here when they are added.
            </p>

          </div>

        ) : (

          <div className="featured-products-grid">

            {featuredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        )}


        <Link
          to="/products"
          className="view-all-products-btn"
        >
          View All Products
        </Link>

      </section>


      {/* =========================
          WHY MINISHOP SECTION
      ========================= */}

      <section className="why-shop">

        <div className="section-heading">

          <span>
            Why MiniShop
          </span>

          <h2>
            Shopping Made Simple
          </h2>

          <p>
            Everything you need for a simple and convenient
            shopping experience.
          </p>

        </div>


        <div className="benefits-grid">

          <div className="benefit-card">

            <div className="benefit-icon">
              ✓
            </div>

            <h3>
              Quality Products
            </h3>

            <p>
              Browse a selection of products across
              multiple categories.
            </p>

          </div>


          <div className="benefit-card">

            <div className="benefit-icon">
              $
            </div>

            <h3>
              Great Prices
            </h3>

            <p>
              Find products at competitive prices
              for your everyday needs.
            </p>

          </div>


          <div className="benefit-card">

            <div className="benefit-icon">
              →
            </div>

            <h3>
              Easy Shopping
            </h3>

            <p>
              Search, browse, add products to your cart,
              and checkout with ease.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="home-cta">

        <div>

          <h2>
            Ready To Start Shopping?
          </h2>

          <p>
            Explore our products and find something
            you'll love.
          </p>

          <Link
            to="/products"
            className="cta-btn"
          >
            Explore Products
          </Link>

        </div>

      </section>

    </section>
  );
}

export default Home;