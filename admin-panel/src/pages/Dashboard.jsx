import { useAuth } from "../hooks/useAuth";
import { ArrowUpRight, Sparkles } from "lucide-react";

function Dashboard() {
  const { admin } = useAuth();

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome__content">
          <span className="welcome-icon"><Sparkles size={20} /></span>
          <p className="eyebrow">Good to see you</p>
          <h1>Welcome back{admin?.email ? "," : ""}</h1>
          {admin?.email && <p className="welcome-email">{admin.email}</p>}
          <p className="welcome-copy">Your salon workspace is ready for the next chapter.</p>
        </div>
        <ArrowUpRight className="welcome-arrow" size={28} aria-hidden="true" />
      </section>
      <section className="dashboard-note">
        <p className="eyebrow">Your workspace</p>
        <h2>Choose a module from the navigation to begin.</h2>
        <p>Management tools will appear here as each module is brought online.</p>
      </section>

    </div>
  );
}

export default Dashboard;