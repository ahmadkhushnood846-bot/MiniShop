import "./Home.css";
import heroShop from "../assets/hero-shop.png.png";

function Home() {

  const categories = [
    "Clothing",
    "Shoes",
    "Electronics",
    "Accessories"
  ];

  return (
    <section className="home">

      {/* Hero Section */}
      <div className="hero">

  <div className="hero-content">

    <h1>
      Shop Everything You Need
    </h1>

    <p>
      Discover quality products at the best prices.
    </p>

    <button>
      Shop Now
    </button>

  </div>


  <div className="hero-image">
  <img src={heroShop} />
  </div>

</div>

      {/* Categories Section */}
      <div className="categories">

        <h2>
          Shop By Category
        </h2>


        <div className="category-grid">

          {categories.map((category, index)=>(
            
            <div className="category-card" key={index}>
              {category}
            </div>

          ))}

        </div>

      </div>


    </section>
  )
}

export default Home;