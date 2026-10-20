import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import "./AdminAddProduct.css";

function AdminEditProduct() {
  const { id } = useParams();

  const { products, categories, updateProduct } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [formData, setFormData] = useState(() => {
    if (!product) {
      return {
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
        rating: "",
        status: "Active",
      };
    }

    return {
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock ?? "",
      rating: product.rating ?? "",
      status: product.status || "Active",
    };
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.image ||
      formData.stock === "" ||
      formData.rating === ""
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    const updatedProduct = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      status: formData.status,
    };

    updateProduct(id, updatedProduct);

    navigate("/admin/products");
  };

  if (!product) {
    return (
      <div className="admin-add-product">
        <div className="form-error">
          Product not found.
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/admin/products")}
        >
          Back To Products
        </button>
      </div>
    );
  }

  return (
    <div className="admin-add-product">

      <div className="add-product-header">

        <div>
          <h1>Edit Product</h1>
          <p>Update your MiniShop product details.</p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/admin/products")}
        >
          Back To Products
        </button>

      </div>

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-group">

          <label>
            Product Name *
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />

        </div>

        <div className="form-group">

          <label>
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
          />

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              Price *
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="20"
              min="0"
              step="0.01"
            />

          </div>

          <div className="form-group">

            <label>
              Stock *
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="10"
              min="0"
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label>
              Rating *
            </label>

            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Product Image URL *
          </label>

          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/product.jpg"
          />

        </div>

        <div className="form-group">

          <label>
            Product Status *
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

        <button
          type="submit"
          className="save-product-btn"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

export default AdminEditProduct;