import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowUpRight, ExternalLink, MapPin, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { useClientAuth } from "../hooks/useClientAuth";

export default function PublicLayout({ settings }) {
  const { user, logout } = useClientAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Gallery", "/gallery"], ["Testimonials", "/testimonials"],
    ["Contact", "/contact"],
  ];
  return <div className="site-shell">
    <header className="site-header"><Link className="brand" to="/" onClick={() => setMenuOpen(false)}><span className="brand-mark">S</span><span>{settings?.salonName || "Salon"}</span></Link><button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">{navigation.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}{user && <><NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink><NavLink to="/my-appointments" onClick={() => setMenuOpen(false)}>My Appointments</NavLink></>}</nav><div className="header-actions">{user ? <button type="button" className="account-link" onClick={async () => { await logout(); navigate("/"); }}>Logout</button> : <><Link className="account-link" to="/login">Login</Link><Link className="account-link" to="/signup">Sign Up</Link></>}<Link className="button button--small" to="/book-appointment">Book now <ArrowUpRight size={16} /></Link></div></header>
    <main><Outlet /></main>
    <footer className="site-footer"><div><Link className="brand" to="/"><span className="brand-mark">S</span><span>{settings?.salonName || "Salon"}</span></Link><p>{settings?.heroDescription || "A considered place for your next beautiful chapter."}</p></div><div className="footer-meta"><span><MapPin size={15} />{settings?.address || "Address unavailable"}</span>{settings?.phone && <a href={`tel:${settings.phone}`}><Phone size={15} />{settings.phone}</a>}{settings?.workingHours && <span>{settings.workingHours}</span>}{settings?.instagramLink && <a href={settings.instagramLink} target="_blank" rel="noreferrer"><ExternalLink size={15} />Instagram</a>}{settings?.facebookLink && <a href={settings.facebookLink} target="_blank" rel="noreferrer"><ExternalLink size={15} />Facebook</a>}</div><small>© {new Date().getFullYear()} {settings?.salonName || "Salon"}</small></footer>
  </div>;
}
