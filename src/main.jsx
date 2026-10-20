import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </StoreProvider>
  </StrictMode>
);