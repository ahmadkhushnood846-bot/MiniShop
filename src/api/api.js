const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";


/* =====================================================
   AUTH HELPERS
===================================================== */


/* =========================
   GET ADMIN TOKEN
========================= */

const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};


/* =========================
   ADMIN HEADERS
========================= */

const getAdminHeaders = () => {

  const token =
    getAdminToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  };
};


/* =========================
   HANDLE API RESPONSE
========================= */

const handleResponse = async (
  response
) => {

  let data = {};

  try {

    data =
      await response.json();

  } catch {

    data = {};

  }


  /* =========================
     UNAUTHORIZED
  ========================= */

  if (
    response.status === 401
  ) {

    localStorage.removeItem(
      "adminToken"
    );


    /*
      Redirect only when the
      current request was made
      from the admin area.
    */

    if (
      window.location.pathname.includes(
        "/admin"
      )
    ) {

      window.location.href =
        "/MiniShop/login";

    }


    throw new Error(
      data.message ||
      "Your session has expired. Please login again."
    );

  }


  /* =========================
     OTHER API ERRORS
  ========================= */

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Something went wrong."
    );

  }


  return data;

};


/* =====================================================
   PRODUCTS
===================================================== */


/* =========================
   GET ALL PRODUCTS
   PUBLIC
========================= */

export const getProducts = async () => {

  const response = await fetch(
    `${API_BASE_URL}/products`
  );


  return handleResponse(
    response
  );

};


/* =========================
   GET SINGLE PRODUCT
   PUBLIC
========================= */

export const getProductById = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/products/${id}`
  );


  try {

    return await handleResponse(
      response
    );

  } catch (error) {

    if (
      response.status === 404
    ) {

      throw new Error(
        "Product not found."
      );

    }


    throw error;

  }

};


/* =========================
   CREATE PRODUCT
   ADMIN ONLY
========================= */

export const createProduct = async (
  product
) => {

  const response = await fetch(
    `${API_BASE_URL}/products`,
    {
      method: "POST",

      headers:
        getAdminHeaders(),

      body:
        JSON.stringify(product),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   UPDATE PRODUCT
   ADMIN ONLY
========================= */

export const updateProduct = async (
  id,
  product
) => {

  const response = await fetch(
    `${API_BASE_URL}/products/${id}`,
    {
      method: "PUT",

      headers:
        getAdminHeaders(),

      body:
        JSON.stringify(product),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   DELETE PRODUCT
   ADMIN ONLY
========================= */

export const deleteProduct = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/products/${id}`,
    {
      method: "DELETE",

      headers:
        getAdminHeaders(),
    }
  );


  return handleResponse(
    response
  );

};


/* =====================================================
   ORDERS
===================================================== */


/* =========================
   GET ALL ORDERS
   ADMIN ONLY
========================= */

export const getOrders = async () => {

  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "GET",

      headers:
        getAdminHeaders(),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   GET SINGLE ORDER
   ADMIN ONLY
========================= */

export const getOrderById = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/orders/${id}`,
    {
      method: "GET",

      headers:
        getAdminHeaders(),
    }
  );


  try {

    return await handleResponse(
      response
    );

  } catch (error) {

    if (
      response.status === 404
    ) {

      throw new Error(
        "Order not found."
      );

    }


    throw error;

  }

};


/* =========================
   CREATE ORDER
   PUBLIC
========================= */

export const createOrder = async (
  order
) => {

  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(order),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   UPDATE ORDER STATUS
   ADMIN ONLY
========================= */

export const updateOrderStatus = async (
  id,
  status
) => {

  const response = await fetch(
    `${API_BASE_URL}/orders/${id}/status`,
    {
      method: "PUT",

      headers:
        getAdminHeaders(),

      body:
        JSON.stringify({
          status,
        }),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   DELETE ORDER
   ADMIN ONLY
========================= */

export const deleteOrder = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/orders/${id}`,
    {
      method: "DELETE",

      headers:
        getAdminHeaders(),
    }
  );


  return handleResponse(
    response
  );

};


/* =====================================================
   ADMIN LOGIN
===================================================== */


/* =========================
   ADMIN LOGIN
========================= */

export const loginAdmin = async (
  email,
  password
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          email,
          password,
        }),
    }
  );


  /*
    Login errors should NOT
    remove adminToken because
    the user may simply have
    entered the wrong password.
  */

  let data = {};

  try {

    data =
      await response.json();

  } catch {

    data = {};

  }


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Invalid email or password."
    );

  }


  return data;

};


/* =====================================================
   CATEGORIES
===================================================== */


/* =========================
   GET ALL CATEGORIES
   PUBLIC
========================= */

export const getCategories = async () => {

  const response = await fetch(
    `${API_BASE_URL}/categories`
  );


  return handleResponse(
    response
  );

};


/* =========================
   GET SINGLE CATEGORY
   PUBLIC
========================= */

export const getCategoryById = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/categories/${id}`
  );


  try {

    return await handleResponse(
      response
    );

  } catch (error) {

    if (
      response.status === 404
    ) {

      throw new Error(
        "Category not found."
      );

    }


    throw error;

  }

};


/* =========================
   CREATE CATEGORY
   ADMIN ONLY
========================= */

export const createCategory = async (
  category
) => {

  const response = await fetch(
    `${API_BASE_URL}/categories`,
    {
      method: "POST",

      headers:
        getAdminHeaders(),

      body:
        JSON.stringify(category),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   UPDATE CATEGORY
   ADMIN ONLY
========================= */

export const updateCategory = async (
  id,
  category
) => {

  const response = await fetch(
    `${API_BASE_URL}/categories/${id}`,
    {
      method: "PUT",

      headers:
        getAdminHeaders(),

      body:
        JSON.stringify(category),
    }
  );


  return handleResponse(
    response
  );

};


/* =========================
   DELETE CATEGORY
   ADMIN ONLY
========================= */

export const deleteCategory = async (
  id
) => {

  const response = await fetch(
    `${API_BASE_URL}/categories/${id}`,
    {
      method: "DELETE",

      headers:
        getAdminHeaders(),
    }
  );


  return handleResponse(
    response
  );

};


/* =====================================================
   API BASE URL
===================================================== */

export {
  API_BASE_URL,
};