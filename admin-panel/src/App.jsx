import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import PlaceholderPage from "./pages/PlaceholderPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

function ModulePlaceholder({ title }) {
  return <PlaceholderPage title={title} />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/appointments"
          element={<ModulePlaceholder title="Appointments" />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        <Route
          path="/enquiries"
          element={<ModulePlaceholder title="Enquiries" />}
        />

        <Route
          path="/about"
          element={<ModulePlaceholder title="About" />}
        />

        <Route
          path="/settings"
          element={<ModulePlaceholder title="Settings" />}
        />

        <Route
          path="/audit-history"
          element={<ModulePlaceholder title="Audit History" />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;