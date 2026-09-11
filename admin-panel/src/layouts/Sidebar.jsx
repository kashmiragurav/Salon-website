import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FileClock,
  Gem,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  Sparkles,
  UserRound,
  X,
  BadgePercent,
  Boxes,
  UsersRound,
  GitCompare,
  CircleHelp,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", path: "/appointments", icon: CalendarDays },
  { label: "Services", path: "/services", icon: Sparkles },
  { label: "Offers", path: "/offers", icon: BadgePercent },
  { label: "Packages", path: "/packages", icon: Boxes },
  { label: "Before & After", path: "/before-after", icon: GitCompare },
  { label: "Team", path: "/team", icon: UsersRound },
  { label: "FAQs", path: "/faqs", icon: CircleHelp },
  { label: "Gallery", path: "/gallery", icon: Images },
  { label: "Testimonials", path: "/testimonials", icon: MessageSquareText },
  { label: "Enquiries", path: "/enquiries", icon: ClipboardList },
  { label: "About", path: "/about", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Audit History", path: "/audit-history", icon: FileClock },
];

function Sidebar({ isOpen, onClose, onLogout }) {
  return (
    <>
      <aside className={`admin-sidebar${isOpen ? " is-open" : ""}`}>
        <div className="sidebar-brand">
          <div>
            <div className="brand-lockup"><Gem size={16} /> <span>Atelier</span></div>
            <h1>Salon administration</h1>
          </div>
          <button type="button" onClick={onClose} className="icon-button sidebar-close" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={onClose}
              className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
            >
              <item.icon size={18} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}

          <div className="sidebar-footer">
            <button type="button" onClick={onLogout} className="sidebar-logout">
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <button type="button" onClick={onClose} className="sidebar-overlay" aria-label="Close mobile navigation overlay" />
      )}
    </>
  );
}

export default Sidebar;