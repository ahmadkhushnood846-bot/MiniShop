import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // LocalStorage se cart load hoga
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("minishop-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cart change hone par LocalStorage update hoga
  useEffect(() => {
    localStorage.setItem("minishop-cart", JSON.stringify(cart));
  }, [cart]);

  // Product cart mein add karna
  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}