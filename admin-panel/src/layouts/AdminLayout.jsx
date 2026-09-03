import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { logoutAdmin } from "../services/authServices";
import { useAuth } from "../hooks/useAuth";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/appointments": "Appointments",
  "/services": "Services",
  "/gallery": "Gallery",
  "/testimonials": "Testimonials",
  "/enquiries": "Enquiries",
  "/about": "About",
  "/settings": "Settings",
  "/audit-history": "Audit History",
};

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTitle = pageTitles[location.pathname] || "Admin";

  const handleLogout = async () => {
    try {
      await logoutAdmin();
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
          onLogout={handleLogout}
        />

        <div className="admin-shell__content">
          <Topbar
            title={currentTitle}
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
    </div>
  );
}

export default AdminLayout;
