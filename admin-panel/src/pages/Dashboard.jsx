import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Images, RefreshCw, Sparkles, Timer } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import RecentBookingsTable from "../components/RecentBookingsTable";
import StatCard from "../components/StatCard";
import { subscribeToDashboard } from "../services/dashboardService";

function Dashboard() {
  const { admin } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToDashboard(
      (data) => {
        setDashboard(data);
        setLoading(false);
      },
      (dashboardError) => {
        console.error("Dashboard data failed to load:", dashboardError);
        setError("We could not load dashboard data. Please try again.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [refreshKey]);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    setRefreshKey((key) => key + 1);
  };

  const stats = dashboard?.stats;
  const recentBookings = dashboard?.recentBookings || [];

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome__content">
          <span className="welcome-icon"><Sparkles size={20} /></span>
          <p className="eyebrow">Good to see you</p>
          <h1>Welcome back{admin?.email ? "," : ""}</h1>
          {admin?.email && <p className="welcome-email">{admin.email}</p>}
          <p className="welcome-copy">Here is the latest view of your salon workspace.</p>
        </div>
        <button type="button" className="dashboard-refresh" onClick={handleRefresh} disabled={loading}>
          <RefreshCw size={16} className={loading ? "is-spinning" : ""} />
          Refresh
        </button>
      </section>

      {error && (
        <section className="dashboard-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleRefresh}>Try again</button>
        </section>
      )}

      <section className="dashboard-stats" aria-label="Dashboard statistics">
        <StatCard label="Total bookings" value={stats?.totalBookings || 0} icon={CalendarDays} tone="wine" loading={loading} />
        <StatCard label="Pending bookings" value={stats?.pendingBookings || 0} icon={Timer} tone="gold" loading={loading} />
        <StatCard label="Active services" value={stats?.activeServices || 0} icon={Sparkles} tone="sage" loading={loading} />
        <StatCard label="Gallery photos" value={stats?.galleryPhotos || 0} icon={Images} tone="plum" loading={loading} />
      </section>

      <section className="dashboard-bookings">
        <div className="dashboard-section-heading">
          <div><p className="eyebrow">Live overview</p><h2>Recent bookings</h2></div>
          <CheckCircle2 size={20} aria-hidden="true" />
        </div>
        {loading && <LoadingSpinner label="Loading bookings" />}
        {!loading && !error && recentBookings.length === 0 && <EmptyState />}
        {!loading && !error && recentBookings.length > 0 && <RecentBookingsTable bookings={recentBookings} />}
      </section>

    </div>
  );
}

export default Dashboard;