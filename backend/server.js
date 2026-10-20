const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const products = require("./data/products");

const app = express();

const PORT = 5000;


/* =====================================================
   ORDERS STORAGE
===================================================== */

const orders = [];


/* =====================================================
   CATEGORIES STORAGE
===================================================== */

const categories = [
  ...new Set(
    products
      .map((product) => product.category)
      .filter(Boolean)
  ),
];


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());

app.use(express.json());


/* =====================================================
   ADMIN AUTHENTICATION
===================================================== */

app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;


    /* =========================
       VALIDATION
    ========================= */

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password are required.",
      });

    }


    /* =========================
       CHECK EMAIL
    ========================= */

    if (email !== process.env.ADMIN_EMAIL) {

      return res.status(401).json({
        message: "Invalid email or password.",
      });

    }


    /* =========================
       CHECK PASSWORD
    ========================= */

    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );


    const passwordMatch =
      await bcrypt.compare(
        password,
        passwordHash
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid email or password.",
      });

    }


    /* =========================
       CREATE JWT TOKEN
    ========================= */

    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "2h",
      }
    );


    /* =========================
       RESPONSE
    ========================= */

    res.json({

      message: "Login successful.",

      token,

      user: {

        email: process.env.ADMIN_EMAIL,

        role: "admin",

      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Server error during login.",
    });

  }

});


/* =====================================================
   ADMIN AUTHENTICATION MIDDLEWARE
===================================================== */

const requireAdmin = (req, res, next) => {


  /* =========================
     GET AUTHORIZATION HEADER
  ========================= */

  const authHeader =
    req.headers.authorization;


  /* =========================
     CHECK HEADER
  ========================= */

  if (!authHeader) {

    return res.status(401).json({

      message:
        "Authentication required.",

    });

  }


  /* =========================
     CHECK BEARER FORMAT
  ========================= */

  const parts =
    authHeader.split(" ");


  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {

    return res.status(401).json({

      message:
        "Invalid authorization format.",

    });

  }


  /* =========================
     GET TOKEN
  ========================= */

  const token =
    parts[1];


  /* =========================
     VERIFY TOKEN
  ========================= */

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    /* =========================
       CHECK ADMIN ROLE
    ========================= */

    if (
      decoded.role !== "admin"
    ) {

      return res.status(403).json({

        message:
          "Admin access required.",

      });

    }


    /* =========================
       STORE USER INFORMATION
    ========================= */

    req.user =
      decoded;


    /* =========================
       CONTINUE REQUEST
    ========================= */

    next();


  } catch (error) {

    return res.status(401).json({

      message:
        "Invalid or expired token.",

    });

  }

};


/* =====================================================
   TEST ROUTE
===================================================== */

app.get("/", (req, res) => {

  res.json({

    message:
      "MiniShop API is running successfully",

  });

});


/* =====================================================
   PRODUCTS
===================================================== */


/* =========================
   GET ALL PRODUCTS
   PUBLIC
========================= */

app.get(
  "/api/products",
  (req, res) => {

    res.json(products);

  }
);


/* =========================
   GET SINGLE PRODUCT
   PUBLIC
========================= */

app.get(
  "/api/products/:id",
  (req, res) => {

    const id =
      Number(req.params.id);


    const product =
      products.find(
        (item) =>
          item.id === id
      );


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    res.json(product);

  }
);


/* =========================
   CREATE PRODUCT
   ADMIN ONLY
========================= */

app.post(
  "/api/products",
  requireAdmin,
  (req, res) => {

    const {

      name,

      price,

      category,

      rating,

      image,

      description,

      stock,

      status,

    } = req.body;


    /* =========================
       VALIDATION
    ========================= */

    if (

      !name ||

      price === undefined ||

      !category ||

      !description ||

      stock === undefined

    ) {

      return res.status(400).json({

        message:
          "Name, price, category, description and stock are required.",

      });

    }


    /* =========================
       CREATE PRODUCT
    ========================= */

    const newProduct = {

      id:
        Date.now(),

      name,

      price:
        Number(price),

      category,

      rating:
        rating !== undefined
          ? Number(rating)
          : 0,

      image:
        image ||
        "https://picsum.photos/300/300",

      description,

      stock:
        Number(stock),

      status:
        status || "Active",

    };


    products.push(
      newProduct
    );


    res.status(201).json(
      newProduct
    );

  }
);


/* =========================
   UPDATE PRODUCT
   ADMIN ONLY
========================= */

app.put(
  "/api/products/:id",
  requireAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);


    const productIndex =
      products.findIndex(
        (item) =>
          item.id === id
      );


    if (productIndex === -1) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    const currentProduct =
      products[productIndex];


    const updatedProduct = {

      ...currentProduct,

      ...req.body,

      id:
        currentProduct.id,

      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : currentProduct.price,

      rating:
        req.body.rating !== undefined
          ? Number(req.body.rating)
          : currentProduct.rating,

      stock:
        req.body.stock !== undefined
          ? Number(req.body.stock)
          : currentProduct.stock,

      status:
        req.body.status ||
        currentProduct.status,

    };


    products[productIndex] =
      updatedProduct;


    res.json(
      updatedProduct
    );

  }
);


/* =========================
   DELETE PRODUCT
   ADMIN ONLY
========================= */

app.delete(
  "/api/products/:id",
  requireAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);


    const productIndex =
      products.findIndex(
        (item) =>
          item.id === id
      );


    if (productIndex === -1) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    const deletedProduct =
      products.splice(
        productIndex,
        1
      )[0];


    res.json({

      message:
        "Product deleted successfully",

      product:
        deletedProduct,

    });

  }
);


/* =====================================================
   CATEGORIES
===================================================== */


/* =========================
   GET ALL CATEGORIES
   PUBLIC
========================= */

app.get(
  "/api/categories",
  (req, res) => {

    res.json(

      categories.map(
        (name, index) => ({

          id:
            index,

          name,

        })
      )

    );

  }
);


/* =========================
   GET SINGLE CATEGORY
   PUBLIC
========================= */

app.get(
  "/api/categories/:id",
  (req, res) => {

    const id =
      Number(req.params.id);


    if (

      Number.isNaN(id) ||

      id < 0 ||

      id >= categories.length

    ) {

      return res.status(404).json({

        message:
          "Category not found.",

      });

    }


    res.json({

      id,

      name:
        categories[id],

    });

  }
);


/* =========================
   CREATE CATEGORY
   ADMIN ONLY
========================= */

app.post(
  "/api/categories",
  requireAdmin,
  (req, res) => {

    const { name } =
      req.body;


    if (
      !name ||
      !name.trim()
    ) {

      return res.status(400).json({

        message:
          "Category name is required.",

      });

    }


    const categoryName =
      name.trim();


    const exists =
      categories.some(
        (category) =>

          category.toLowerCase() ===
          categoryName.toLowerCase()

      );


    if (exists) {

      return res.status(409).json({

        message:
          "Category already exists.",

      });

    }


    categories.push(
      categoryName
    );


    res.status(201).json({

      id:
        categories.length - 1,

      name:
        categoryName,

    });

  }
);


/* =========================
   UPDATE CATEGORY
   ADMIN ONLY
========================= */

app.put(
  "/api/categories/:id",
  requireAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);


    const { name } =
      req.body;


    if (

      Number.isNaN(id) ||

      id < 0 ||

      id >= categories.length

    ) {

      return res.status(404).json({

        message:
          "Category not found.",

      });

    }


    if (
      !name ||
      !name.trim()
    ) {

      return res.status(400).json({

        message:
          "Category name is required.",

      });

    }


    const newName =
      name.trim();


    const oldName =
      categories[id];


    const exists =
      categories.some(

        (category, index) =>

          index !== id &&

          category.toLowerCase() ===
            newName.toLowerCase()

      );


    if (exists) {

      return res.status(409).json({

        message:
          "Category already exists.",

      });

    }


    categories[id] =
      newName;


    /* =========================
       UPDATE PRODUCTS
    ========================= */

    products.forEach(
      (product) => {

        if (
          product.category ===
          oldName
        ) {

          product.category =
            newName;

        }

      }
    );


    res.json({

      id,

      name:
        newName,

    });

  }
);


/* =========================
   DELETE CATEGORY
   ADMIN ONLY
========================= */

app.delete(
  "/api/categories/:id",
  requireAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);


    if (

      Number.isNaN(id) ||

      id < 0 ||

      id >= categories.length

    ) {

      return res.status(404).json({

        message:
          "Category not found.",

      });

    }


    const categoryName =
      categories[id];


    /* =========================
       CHECK PRODUCT USAGE
    ========================= */

    const productsUsingCategory =
      products.some(
        (product) =>

          product.category ===
          categoryName

      );


    if (
      productsUsingCategory
    ) {

      return res.status(400).json({

        message:
          "Cannot delete category because products are using it.",

      });

    }


    categories.splice(
      id,
      1
    );


    res.json({

      message:
        "Category deleted successfully.",

    });

  }
);


/* =====================================================
   ORDERS
===================================================== */


/* =========================
   GET ALL ORDERS
   ADMIN ONLY
========================= */

app.get(
  "/api/orders",
  requireAdmin,
  (req, res) => {

    res.json(orders);

  }
);


/* =========================
   GET SINGLE ORDER
   ADMIN ONLY
========================= */

app.get(
  "/api/orders/:id",
  requireAdmin,
  (req, res) => {

    const order =
      orders.find(
        (item) =>
          item.id ===
          req.params.id
      );


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    res.json(order);

  }
);


/* =========================
   CREATE ORDER
   PUBLIC
========================= */

app.post(
  "/api/orders",
  (req, res) => {

    const {

      customer,

      items,

      subtotal,

      shippingCost,

      total,

    } = req.body;


    /* =========================
       CUSTOMER VALIDATION
    ========================= */

    if (

      !customer ||

      !customer.firstName ||

      !customer.lastName ||

      !customer.email ||

      !customer.phone ||

      !customer.address ||

      !customer.city ||

      !customer.postalCode

    ) {

      return res.status(400).json({

        message:
          "Complete customer information is required.",

      });

    }


    /* =========================
       ITEMS VALIDATION
    ========================= */

    if (

      !Array.isArray(items) ||

      items.length === 0

    ) {

      return res.status(400).json({

        message:
          "Order must contain at least one product.",

      });

    }


    /* =========================
       CREATE ORDER
    ========================= */

    const newOrder = {

      id:
        `MS-${Date.now()}`,

      customer: {

        firstName:
          customer.firstName.trim(),

        lastName:
          customer.lastName.trim(),

        email:
          customer.email.trim(),

        phone:
          customer.phone.trim(),

        address:
          customer.address.trim(),

        city:
          customer.city.trim(),

        postalCode:
          customer.postalCode.trim(),

      },


      items:
        items.map(
          (item) => ({

            id:
              item.id,

            name:
              item.name,

            price:
              Number(item.price) || 0,

            quantity:
              Number(item.quantity) || 0,

            image:
              item.image,

          })
        ),


      subtotal:
        Number(subtotal) || 0,


      shippingCost:
        Number(shippingCost) || 0,


      total:
        Number(total) || 0,


      status:
        "Pending",


      createdAt:
        new Date().toISOString(),

    };


    orders.push(
      newOrder
    );


    res.status(201).json(
      newOrder
    );

  }
);


/* =========================
   UPDATE ORDER STATUS
   ADMIN ONLY
========================= */

app.put(
  "/api/orders/:id/status",
  requireAdmin,
  (req, res) => {

    const order =
      orders.find(
        (item) =>
          item.id ===
          req.params.id
      );


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    const allowedStatuses = [

      "Pending",

      "Confirmed",

      "Processing",

      "Shipped",

      "Delivered",

      "Cancelled",

    ];


    if (
      !allowedStatuses.includes(
        req.body.status
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid order status.",

      });

    }


    order.status =
      req.body.status;


    res.json(order);

  }
);


/* =========================
   DELETE ORDER
   ADMIN ONLY
========================= */

app.delete(
  "/api/orders/:id",
  requireAdmin,
  (req, res) => {

    const orderIndex =
      orders.findIndex(
        (order) =>

          order.id ===
          req.params.id

      );


    if (orderIndex === -1) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    const deletedOrder =
      orders.splice(
        orderIndex,
        1
      )[0];


    res.json({

      message:
        "Order deleted successfully",

      order:
        deletedOrder,

    });

  }
);


/* =====================================================
   START SERVER
===================================================== */

const server =
  app.listen(
    PORT,
    () => {

      console.log(
        `MiniShop API running on http://localhost:${PORT}`
      );

    }
  );


/* =========================
   SERVER ERROR
========================= */

server.on(
  "error",
  (error) => {

    console.error(
      "SERVER ERROR:",
      error
    );

  }
);


/* =========================
   SERVER CLOSE
========================= */

server.on(
  "close",
  () => {

    console.log(
      "SERVER CLOSED"
    );

  }
);