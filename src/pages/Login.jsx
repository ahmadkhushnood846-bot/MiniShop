import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>MiniShop</h1>
          <h2>Admin Login</h2>
          <p>
            Sign in to manage your MiniShop store.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="login-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>


          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>
    </main>
  );
}

export default Login;