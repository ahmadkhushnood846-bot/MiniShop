import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";


function ProductDetails() {


  const { id } = useParams();


  const product = products.find(
    (item) => item.id === Number(id)
  );


  const [quantity, setQuantity] = useState(1);


  const { addToCart } = useContext(CartContext);



  if (!product) {
    return <h2>Product Not Found</h2>;
  }



  return (

    <div className="product-details-section">


      <div className="product-details">



        <img
          src={product.image}
          alt={product.name}
        />



        <div className="product-info">


          <h1>
            {product.name}
          </h1>



          <p>
            Price: ${product.price}
          </p>



          <p>
            Category: {product.category}
          </p>



          <p>
            Rating: ⭐ {product.rating}
          </p>




          <div className="quantity">


            <button
              onClick={() =>
                setQuantity(
                  quantity > 1 ? quantity - 1 : 1
                )
              }
            >
              -
            </button>



            <span>
              {quantity}
            </span>



            <button
              onClick={() =>
                setQuantity(quantity + 1)
              }
            >
              +
            </button>


          </div>




          <button
            className="cart-btn"
            onClick={() =>
              addToCart(product, quantity)
            }
          >
            Add To Cart
          </button>



        </div>



      </div>


    </div>

  );
}



export default ProductDetails;