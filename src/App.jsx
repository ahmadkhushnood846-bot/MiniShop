import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Footer from "./components/Footer";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>


        <Route 
          path="/" 
          element={<Home />} 
        />


        <Route 
          path="/products" 
          element={<Products />} 
        />


        <Route 
          path="/product/:id" 
          element={<ProductDetails />} 
        />


        <Route 
          path="/cart" 
          element={<Cart />} 
        />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/order-success" element={<OrderSuccess />} />


      </Routes>

      <Footer />


    </BrowserRouter>

  );

}


export default App;