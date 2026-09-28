import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


function ProductCard({ product }) {

  const { setCart } = useContext(CartContext);


  const addToCart = (product) => {

    setCart((prev) => {

      const existing = prev.find(
        (item) => item.id === product.id
      );


      if (existing) {

        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }


      return [
        ...prev,
        {
          ...product,
          quantity: 1
        }
      ];

    });

  };


  return (

    <div className="product-card">


      <img
        src={product.image}
        alt={product.name}
      />


      <h3>
        {product.name}
      </h3>


      <p>
        Price: ${product.price}
      </p>


      <p>
        Category: {product.category}
      </p>


      <p>
        Rating: ⭐ {product.rating}
      </p>


      <button onClick={() => addToCart(product)}>
        Add To Cart
      </button>


      <Link to={`/product/${product.id}`}>
        View Details
      </Link>


    </div>

  );

}


export default ProductCard;