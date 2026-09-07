import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import { useSalonSettings } from "./hooks/useSalonData";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Testimonials from "./pages/Testimonials";
import Profile from "./pages/Profile";
import MyAppointments from "./pages/MyAppointments";
import ProtectedClientRoute from "./components/ProtectedClientRoute";

function App() {
  const settings = useSalonSettings();
  return <Routes><Route element={<PublicLayout settings={settings.data} />}>
    <Route path="/" element={<Home settings={settings} />} />
    <Route path="/about" element={<About settings={settings} />} />
    <Route path="/services" element={<Services />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/testimonials" element={<Testimonials />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/contact" element={<Contact settings={settings} />} />
    <Route element={<ProtectedClientRoute />}>
      <Route path="/book-appointment" element={<BookAppointment />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route element={<ProtectedClientRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes>;
}

export default App;