import { createContext, useEffect, useState } from "react";

import {
  getProducts,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,

  getCategories,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from "../api/api";

import productsData from "../data/products";

export const StoreContext = createContext();


/* =========================
   DEFAULT CATEGORIES
========================= */

const defaultCategories = [
  {
    id: 1,
    name: "Clothing",
    description: "Clothing and fashion products.",
    status: "Active",
  },

  {
    id: 2,
    name: "Shoes",
    description: "Shoes and footwear products.",
    status: "Active",
  },

  {
    id: 3,
    name: "Electronics",
    description: "Electronic devices and accessories.",
    status: "Active",
  },

  {
    id: 4,
    name: "Accessories",
    description: "Useful fashion and lifestyle accessories.",
    status: "Active",
  },
];


/* =========================
   PREPARE PRODUCTS
========================= */

const prepareProducts = (products) => {

  return products.map((product) => ({
    ...product,

    stock:
      product.stock !== undefined
        ? Number(product.stock)
        : 10,

    status:
      product.status || "Active",
  }));

};


/* =========================
   STORE PROVIDER
========================= */

export function StoreProvider({ children }) {


  /* =========================
     PRODUCTS STATE
  ========================= */

  const [products, setProducts] = useState(() => {

    const savedProducts =
      localStorage.getItem("minishop-products");

    return savedProducts
      ? JSON.parse(savedProducts)
      : prepareProducts(productsData);

  });


  const [productsLoading, setProductsLoading] =
    useState(true);


  /* =========================
     LOAD PRODUCTS FROM API
  ========================= */

  useEffect(() => {

    const loadProducts = async () => {

      try {

        setProductsLoading(true);

        const data = await getProducts();

        const preparedProducts =
          prepareProducts(data);

        setProducts(preparedProducts);

        localStorage.setItem(
          "minishop-products",
          JSON.stringify(preparedProducts)
        );

      } catch (error) {

        console.error(
          "Unable to load products from API:",
          error
        );

        // Keep local products as fallback

      } finally {

        setProductsLoading(false);

      }

    };


    loadProducts();

  }, []);


  /* =========================
     CATEGORIES STATE
  ========================= */

  const [categories, setCategories] = useState(() => {

    const savedCategories =
      localStorage.getItem(
        "minishop-categories"
      );

    return savedCategories
      ? JSON.parse(savedCategories)
      : defaultCategories;

  });


  const [categoriesLoading, setCategoriesLoading] =
    useState(true);


  /* =========================
     LOAD CATEGORIES FROM API
  ========================= */

  useEffect(() => {

    const loadCategories = async () => {

      try {

        setCategoriesLoading(true);

        const data = await getCategories();

        if (Array.isArray(data)) {

          setCategories(data);

          localStorage.setItem(
            "minishop-categories",
            JSON.stringify(data)
          );

        }

      } catch (error) {

        console.error(
          "Unable to load categories from API:",
          error
        );

        // Keep local categories as fallback

      } finally {

        setCategoriesLoading(false);

      }

    };


    loadCategories();

  }, []);


  /* =========================
     ORDERS STATE
  ========================= */

  const [orders, setOrders] = useState(() => {

    const savedOrders =
      localStorage.getItem(
        "minishop-orders"
      );

    return savedOrders
      ? JSON.parse(savedOrders)
      : [];

  });


  /* =========================
     SAVE PRODUCTS
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "minishop-products",
      JSON.stringify(products)
    );

  }, [products]);


  /* =========================
     SAVE CATEGORIES
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "minishop-categories",
      JSON.stringify(categories)
    );

  }, [categories]);


  /* =========================
     SAVE ORDERS
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "minishop-orders",
      JSON.stringify(orders)
    );

  }, [orders]);


  /* =====================================================
     PRODUCT FUNCTIONS
  ===================================================== */


  /* =========================
     ADD PRODUCT
  ========================= */

  const addProduct = async (product) => {

    try {

      const newProduct =
        await createProductAPI({

          ...product,

          price:
            Number(product.price),

          rating:
            Number(product.rating) || 0,

          stock:
            Number(product.stock) || 0,

          status:
            product.status || "Active",

        });


      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct,
      ]);


      return newProduct;

    } catch (error) {

      console.error(
        "Create product error:",
        error
      );

      throw error;

    }

  };


  /* =========================
     UPDATE PRODUCT
  ========================= */

  const updateProduct = async (
    id,
    updatedProduct
  ) => {

    try {

      const updated =
        await updateProductAPI(
          id,
          {

            ...updatedProduct,

            price:
              Number(updatedProduct.price),

            rating:
              Number(updatedProduct.rating) || 0,

            stock:
              Number(updatedProduct.stock) || 0,

            status:
              updatedProduct.status || "Active",

          }
        );


      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === Number(id)
            ? updated
            : product
        )
      );


      return updated;

    } catch (error) {

      console.error(
        "Update product error:",
        error
      );

      throw error;

    }

  };


  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct = async (id) => {

    try {

      await deleteProductAPI(id);


      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== Number(id)
        )
      );

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );

      throw error;

    }

  };


  /* =========================
     UPDATE PRODUCT STOCK
  ========================= */

  const updateProductStock = async (
    id,
    stock
  ) => {

    const product =
      products.find(
        (item) =>
          item.id === Number(id)
      );


    if (!product) {
      return;
    }


    await updateProduct(
      id,
      {
        ...product,
        stock: Number(stock),
      }
    );

  };


  /* =========================
     UPDATE PRODUCT STATUS
  ========================= */

  const updateProductStatus = async (
    id,
    status
  ) => {

    const product =
      products.find(
        (item) =>
          item.id === Number(id)
      );


    if (!product) {
      return;
    }


    await updateProduct(
      id,
      {
        ...product,
        status,
      }
    );

  };


  /* =====================================================
     CATEGORY FUNCTIONS
  ===================================================== */


  /* =========================
     ADD CATEGORY
  ========================= */

  const addCategory = async (category) => {

    try {

      const newCategory =
        await createCategoryAPI({

          name:
            category.name.trim(),

          description:
            category.description.trim(),

          status:
            category.status || "Active",

        });


      setCategories((currentCategories) => [

        ...currentCategories,

        newCategory,

      ]);


      return newCategory;

    } catch (error) {

      console.error(
        "Create category error:",
        error
      );

      throw error;

    }

  };


  /* =========================
     UPDATE CATEGORY
  ========================= */

  const updateCategory = async (
    id,
    updatedCategory
  ) => {

    try {

      const updated =
        await updateCategoryAPI(
          id,
          {

            name:
              updatedCategory.name.trim(),

            description:
              updatedCategory.description.trim(),

            status:
              updatedCategory.status || "Active",

          }
        );


      setCategories((currentCategories) =>
        currentCategories.map(
          (category) =>
            category.id === Number(id)
              ? updated
              : category
        )
      );


      return updated;

    } catch (error) {

      console.error(
        "Update category error:",
        error
      );

      throw error;

    }

  };


  /* =========================
     DELETE CATEGORY
  ========================= */

  const deleteCategory = async (id) => {

  try {

    await deleteCategoryAPI(id);


    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) =>
          String(category.id) !== String(id)
      )
    );


  } catch (error) {

    console.error(
      "Delete category error:",
      error
    );

    throw error;

  }

};

  /* =====================================================
     ORDER FUNCTIONS
  ===================================================== */


  /* =========================
     ADD ORDER
  ========================= */

  const addOrder = (order) => {

    const newOrder = {

      ...order,

      id:
        order.id ||
        `MS-${Date.now()}`,

      customer: {
        ...order.customer,
      },

      items:
        Array.isArray(order.items)
          ? order.items.map((item) => ({
              ...item,

              price:
                Number(item.price) || 0,

              quantity:
                Number(item.quantity) || 0,
            }))
          : [],

      total:
        Number(order.total) || 0,

      status:
        order.status || "Pending",

      createdAt:
        order.createdAt ||
        new Date().toISOString(),

    };


    setOrders((currentOrders) => [
      ...currentOrders,
      newOrder,
    ]);


    return newOrder;

  };


  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateOrderStatus = (
    id,
    status
  ) => {

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
    );

  };


  /* =========================
     DELETE ORDER
  ========================= */

  const deleteOrder = (id) => {

    setOrders((currentOrders) =>
      currentOrders.filter(
        (order) =>
          order.id !== id
      )
    );

  };


  /* =====================================================
     PROVIDER
  ===================================================== */

  return (

    <StoreContext.Provider
      value={{

        /* Products */

        products,

        productsLoading,

        addProduct,

        updateProduct,

        deleteProduct,

        updateProductStock,

        updateProductStatus,


        /* Categories */

        categories,

        categoriesLoading,

        addCategory,

        updateCategory,

        deleteCategory,


        /* Orders */

        orders,

        addOrder,

        updateOrderStatus,

        deleteOrder,

      }}
    >

      {children}

    </StoreContext.Provider>

  );

}