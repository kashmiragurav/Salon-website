import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ConfirmModal from "../components/ConfirmModal";

import { logoutAdmin } from "../services/authServices";
import { useAuth } from "../hooks/useAuth";

function AdminLayout() {
  const navigate = useNavigate();
  const { admin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setLogoutOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__panel">
          <span className="loading-mark" aria-hidden="true" />
          <p>Checking authentication</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-shell">
      <div className="admin-shell__body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={() => setLogoutOpen(true)}
        />

        <div className="admin-shell__content">
          <Topbar
            userEmail={admin?.email || "Admin"}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="admin-main">
            <div className="admin-main__inner">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      {logoutOpen && <ConfirmModal title="Are you sure you want to logout?" message="Your admin session will be cleared on this device." confirmLabel="Logout" onConfirm={handleLogout} onCancel={() => setLogoutOpen(false)} />}
    </div>
  );
}

export default AdminLayout;
