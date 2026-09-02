import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { logoutAdmin } from "../services/authServices";

function Dashboard() {
  const { admin } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();

    navigate("/login");
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">

      <div className="bg-white rounded-xl p-8 shadow">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-3">
          Welcome, {admin?.email}
        </p>

        <div className="mt-8 p-5 bg-green-50 rounded-lg">
          Firebase admin authentication is working.
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;