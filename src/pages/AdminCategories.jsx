import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/api";

import "./AdminCategories.css";


function AdminCategories() {

  /* =====================================================
     CATEGORIES STATE
  ===================================================== */

  const [categories, setCategories] =
    useState([]);


  /* =====================================================
     SEARCH STATE
  ===================================================== */

  const [searchTerm, setSearchTerm] =
    useState("");


  /* =====================================================
     FORM STATE
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });


  /* =====================================================
     EDIT STATE
  ===================================================== */

  const [editingId, setEditingId] =
    useState(null);


  /* =====================================================
     LOADING STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     SAVING STATE
  ===================================================== */

  const [isSaving, setIsSaving] =
    useState(false);


  /* =====================================================
     DELETING STATE
  ===================================================== */

  const [deletingId, setDeletingId] =
    useState(null);


  /* =====================================================
     ERROR STATE
  ===================================================== */

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD CATEGORIES
  ===================================================== */

  const loadCategories = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getCategories();


      const formattedCategories =
        Array.isArray(data)
          ? data.map((category) => {

              if (
                typeof category ===
                "string"
              ) {

                return {
                  id: category,
                  name: category,
                  description: "",
                  status: "Active",
                };

              }


              return {
                id: category.id,
                name: category.name || "",
                description:
                  category.description || "",
                status:
                  category.status || "Active",
              };

            })
          : [];


      setCategories(
        formattedCategories
      );


    } catch (err) {

      console.error(
        "Load categories error:",
        err
      );


      setError(
        err.message ||
        "Failed to load categories."
      );


    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {

    loadCategories();

  }, []);


  /* =====================================================
     FILTER CATEGORIES
  ===================================================== */

  const filteredCategories =
    categories.filter(
      (category) =>

        String(
          category.name || ""
        )
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );


    setError("");

  };


  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {

    setFormData({

      name: "",

      description: "",

      status: "Active",

    });


    setEditingId(null);

    setError("");

  };


  /* =====================================================
     SUBMIT CATEGORY
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    const categoryName =
      formData.name.trim();


    const categoryDescription =
      formData.description.trim();


    /* =========================
       VALIDATION
    ========================= */

    if (!categoryName) {

      setError(
        "Category name is required."
      );

      return;

    }


    /* =========================
       DUPLICATE CHECK
    ========================= */

    const duplicateCategory =
      categories.some(
        (category) =>

          category.name
            .toLowerCase() ===
          categoryName.toLowerCase() &&

          String(category.id) !==
            String(editingId)
      );


    if (duplicateCategory) {

      setError(
        "This category already exists."
      );

      return;

    }


    try {

      setIsSaving(true);

      setError("");


      /* =================================================
         UPDATE
      ================================================= */

      if (editingId !== null) {

        const updated =
          await updateCategory(
            editingId,
            {
              name:
                categoryName,

              description:
                categoryDescription,

              status:
                formData.status,
            }
          );


        /* =========================
           UPDATE LOCAL STATE
        ========================= */

        setCategories(
          (previousCategories) =>

            previousCategories.map(
              (category) =>

                String(category.id) ===
                String(editingId)

                  ? {
                      ...category,

                      name:
                        updated.name ||
                        categoryName,

                      description:
                        updated.description ||
                        categoryDescription,

                      status:
                        updated.status ||
                        formData.status,
                    }

                  : category
            )
        );

      }


      /* =================================================
         CREATE
      ================================================= */

      else {

        const created =
          await createCategory({

            name:
              categoryName,

            description:
              categoryDescription,

            status:
              formData.status,

          });


        /* =========================
           ADD TO LOCAL STATE
        ========================= */

        const newCategory = {

          id:
            created.id,

          name:
            created.name ||
            categoryName,

          description:
            created.description ||
            categoryDescription,

          status:
            created.status ||
            formData.status,

        };


        setCategories(
          (previousCategories) => [

            ...previousCategories,

            newCategory,

          ]
        );

      }


      /* =========================
         RESET
      ========================= */

      resetForm();


    } catch (err) {

      console.error(
        "Category save error:",
        err
      );


      setError(
        err.message ||
        "Failed to save category."
      );


    } finally {

      setIsSaving(false);

    }

  };


  /* =====================================================
     EDIT CATEGORY
  ===================================================== */

  const handleEdit = (category) => {

    setEditingId(
      category.id
    );


    setFormData({

      name:
        category.name || "",

      description:
        category.description || "",

      status:
        category.status || "Active",

    });


    setError("");


    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };


  /* =====================================================
     DELETE CATEGORY
  ===================================================== */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(id);

      setError("");


      /* =========================
         DELETE FROM API
      ========================= */

      await deleteCategory(id);


      /* =========================
         UPDATE LOCAL STATE
      ========================= */

      setCategories(
        (previousCategories) =>

          previousCategories.filter(
            (category) =>
              String(category.id) !==
              String(id)
          )
      );


      /* =========================
         RESET EDIT FORM
      ========================= */

      if (
        String(editingId) ===
        String(id)
      ) {

        resetForm();

      }


    } catch (err) {

      console.error(
        "Delete category error:",
        err
      );


      setError(
        err.message ||
        "Failed to delete category."
      );


    } finally {

      setDeletingId(null);

    }

  };


  /* =====================================================
     LOADING UI
  ===================================================== */

  if (loading) {

    return (

      <div className="admin-categories">

        <div className="admin-categories-header">

          <div>

            <h1>
              Categories
            </h1>

            <p>
              Manage your MiniShop store categories.
            </p>

          </div>

        </div>


        <div className="admin-category-empty">

          <h2>
            Loading Categories...
          </h2>

          <p>
            Please wait while we load
            your categories.
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="admin-categories">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-categories-header">

        <div>

          <h1>
            Categories
          </h1>

          <p>
            Manage your MiniShop store categories.
          </p>

        </div>


        <Link
          to="/admin"
          className="back-admin-btn"
        >
          Back To Dashboard
        </Link>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="category-form-error">

          {error}

        </div>

      )}


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      <div className="category-form-card">


        <div className="category-form-header">

          <div>

            <h2>

              {editingId !== null
                ? "Edit Category"
                : "Add Category"}

            </h2>


            <p>

              {editingId !== null
                ? "Update your category details."
                : "Create a new store category."}

            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
        >


          {/* =================================================
              FORM ROW
          ================================================= */}

          <div className="category-form-row">


            {/* CATEGORY NAME */}

            <div className="category-form-group">

              <label>
                Category Name *
              </label>


              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Home & Living"
                disabled={isSaving}
              />

            </div>


            {/* STATUS */}

            <div className="category-form-group">

              <label>
                Status *
              </label>


              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSaving}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="category-form-group">

            <label>
              Description
            </label>


            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="3"
              disabled={isSaving}
            />

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="category-form-actions">


            <button
              type="submit"
              className="save-category-btn"
              disabled={isSaving}
            >

              {isSaving

                ? editingId !== null
                  ? "Updating..."
                  : "Adding..."

                : editingId !== null
                  ? "Update Category"
                  : "Add Category"}

            </button>


            {editingId !== null && (

              <button
                type="button"
                className="cancel-category-btn"
                onClick={resetForm}
                disabled={isSaving}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="categories-toolbar">

        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />

      </div>


      {/* =================================================
          CATEGORY COUNT
      ================================================= */}

      <div className="categories-result-count">

        {filteredCategories.length}

        {" "}

        categor
        {filteredCategories.length !== 1
          ? "ies"
          : "y"}

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredCategories.length === 0 ? (

        <div className="admin-category-empty">

          <h2>
            No Categories Found
          </h2>

          <p>

            {searchTerm
              ? "Try a different category name."
              : "No categories are available yet."}

          </p>

        </div>

      ) : (


        /* =================================================
           TABLE
        ================================================= */

        <div className="admin-categories-table-wrapper">

          <table className="admin-categories-table">


            <thead>

              <tr>

                <th>
                  Category
                </th>

                <th>
                  Description
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredCategories.map(
                (category) => (

                  <tr
                    key={category.id}
                  >


                    {/* CATEGORY */}

                    <td
                      data-label="Category"
                    >

                      <strong>
                        {category.name}
                      </strong>

                    </td>


                    {/* DESCRIPTION */}

                    <td
                      data-label="Description"
                    >

                      {category.description ||
                        "—"}

                    </td>


                    {/* STATUS */}

                    <td
                      data-label="Status"
                    >

                      <span
                        className={
                          category.status ===
                          "Active"

                            ? "category-status active"

                            : "category-status inactive"
                        }
                      >

                        {category.status ||
                          "Active"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td
                      data-label="Actions"
                    >

                      <div className="category-actions">


                        {/* EDIT */}

                        <button
                          type="button"
                          className="edit-category-btn"
                          onClick={() =>
                            handleEdit(
                              category
                            )
                          }
                          disabled={
                            deletingId !==
                            null
                          }
                        >
                          Edit
                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-category-btn"
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                          disabled={
                            deletingId ===
                            category.id
                          }
                        >

                          {deletingId ===
                          category.id

                            ? "Deleting..."

                            : "Delete"}

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}


export default AdminCategories;