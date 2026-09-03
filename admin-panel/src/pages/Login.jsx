import { useState } from "react";
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

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Salon Website
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Admin Login
          </h1>

          <p className="text-neutral-500 mt-2">
            Sign in to manage your salon website.
          </p>

        </div>

        {error && (
          <div className="mb-5 bg-red-50 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="admin@example.com"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Enter your password"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
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