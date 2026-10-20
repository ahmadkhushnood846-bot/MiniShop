const API_BASE_URL = "http://localhost:5000/api";

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Unable to load products.");
  }

  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Product not found.");
    }

    throw new Error("Unable to load product.");
  }

  return response.json();
};

export { API_BASE_URL };