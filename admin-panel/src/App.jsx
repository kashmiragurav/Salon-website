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
import Appointments from "./pages/Appointments";
import Enquiries from "./pages/Enquiries";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AuditHistory from "./pages/AuditHistory";
import Offers from "./pages/Offers";
import Packages from "./pages/Packages";
import Team from "./pages/Team";
import BeforeAfter from "./pages/BeforeAfter";
import FAQs from "./pages/FAQs";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

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
          element={<Appointments />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route path="/offers" element={<Offers />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/team" element={<Team />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/faqs" element={<FAQs />} />

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
          element={<Enquiries />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/audit-history"
          element={<AuditHistory />}
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