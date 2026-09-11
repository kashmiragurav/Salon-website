import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../services/authServices";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();

  const { setAdmin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({});

  const handleChange = (event) => {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    setForm({
      ...nextForm,
    });
    setValidation((current) => ({ ...current, [event.target.name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextValidation = {};
    if (!form.email.trim()) nextValidation.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextValidation.email = "Please enter a valid email address.";
    if (!form.password) nextValidation.password = "Password is required.";
    if (Object.keys(nextValidation).length) {
      setValidation(nextValidation);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const adminData = await loginAdmin(
        form.email,
        form.password
      );

      setAdmin(adminData);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">

      <div className="admin-login__panel">

        <div className="admin-login__head">

          <p className="eyebrow">
            Salon Website
          </p>

          <h1>
            Admin Login
          </h1>

          <p className="admin-login__hint">
            Sign in to manage your salon website.
          </p>

        </div>

        {error && (
          <div className="admin-login__error" role="alert">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="admin-login__form"
        >

          <label className="form-field">

            <span>Email *</span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-invalid={Boolean(validation.email)}
              placeholder="admin@example.com"
            />
            {validation.email && <small>{validation.email}</small>}

          </label>

          <label className="form-field">

            <span>Password *</span>

            <span className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                aria-invalid={Boolean(validation.password)}
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </span>
            {validation.password && <small>{validation.password}</small>}

          </label>

          <button
            type="submit"
            disabled={loading}
            className="button-primary admin-login__submit"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;