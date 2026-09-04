import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

export default function PublicLayout({ settings }) {
  const navigation = [
    ["About", "/about"], ["Services", "/services"], ["Gallery", "/gallery"],
    ["Pricing", "/pricing"], ["Contact", "/contact"],
  ];
  return <div className="site-shell">
    <header className="site-header"><Link className="brand" to="/"><span className="brand-mark">S</span><span>{settings?.salonName || "Salon"}</span></Link><nav className="site-nav" aria-label="Main navigation">{navigation.map(([label, path]) => <NavLink key={path} to={path}>{label}</NavLink>)}</nav><Link className="button button--small" to="/book-appointment">Book now <ArrowUpRight size={16} /></Link></header>
    <main><Outlet /></main>
    <footer className="site-footer"><div><Link className="brand" to="/"><span className="brand-mark">S</span><span>{settings?.salonName || "Salon"}</span></Link><p>A considered place for your next beautiful chapter.</p></div><div className="footer-meta"><span><MapPin size={15} />{settings?.address || "Address unavailable"}</span>{settings?.instagramLink && <a href={settings.instagramLink} target="_blank" rel="noreferrer"><ExternalLink size={15} />Instagram</a>}</div><small>© {new Date().getFullYear()} {settings?.salonName || "Salon"}</small></footer>
  </div>;
}
