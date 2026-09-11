import { Menu, ShieldCheck } from "lucide-react";

function Topbar({ userEmail, onMenuClick }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__inner">
        <div className="topbar-heading">
          <button
            type="button"
            onClick={onMenuClick}
            className="icon-button menu-button"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="eyebrow">Workspace</p>
          </div>
        </div>

        <div className="topbar-user">
          <div className="topbar-avatar">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="topbar-user__details">
            <p className="eyebrow">Administrator</p>
            <p>{userEmail || "Admin"}</p>
          </div>
          <ShieldCheck className="topbar-check" size={17} aria-label="Verified administrator" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
