import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Clock3, Search, ShieldCheck, X } from "lucide-react";

import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { AUDIT_ACTIONS } from "../services/auditService";
import { subscribeToAuditLogs } from "../services/auditHistoryService";

const modules = ["Services", "Gallery", "Testimonials", "Appointments", "Enquiries", "Settings"];

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
};

function AuditHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuditLogs(
      (data) => { setLogs(data); setLoading(false); setError(""); },
      (auditError) => {
        console.error("Audit history failed to load:", auditError);
        setError("We could not load audit history from Firestore.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const visibleLogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.createdAt || "");
      const dateMatches = !dateFilter || (Number.isNaN(logDate.getTime()) ? false : logDate.toISOString().slice(0, 10) === dateFilter);
      const searchMatches = !term || [log.description, log.recordId, log.adminId].some((value) => String(value || "").toLowerCase().includes(term));
      return (!moduleFilter || log.module === moduleFilter) && (!actionFilter || log.action === actionFilter) && dateMatches && searchMatches;
    });
  }, [logs, moduleFilter, actionFilter, dateFilter, search]);

  return <div className="audit-page">
    <header className="module-heading"><div><p className="eyebrow">Accountability</p><h1>Audit history</h1><p>Review changes made across the admin workspace.</p></div></header>
    <div className="audit-notice"><ShieldCheck size={16} /><span>Client-side audit trail. These logs are useful for visibility but are not immutable or server-trusted. Sensitive authentication information is never recorded.</span></div>
    {error && <div className="module-error" role="alert">{error}</div>}
    <section className="service-toolbar" aria-label="Audit history filters">
      <label className="search-field"><Search size={17} /><span className="sr-only">Search audit history</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search descriptions or record IDs" /></label>
      <label className="filter-field"><span>Module</span><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}><option value="">All modules</option>{modules.map((module) => <option key={module} value={module}>{module}</option>)}</select></label>
      <label className="filter-field"><span>Action</span><select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}><option value="">All actions</option>{AUDIT_ACTIONS.map((action) => <option key={action} value={action}>{action}</option>)}</select></label>
      <label className="date-filter"><span>Date</span><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
    </section>
    <section className="audit-list" aria-label="Audit history list">
      {loading && <LoadingSpinner label="Loading audit history" />}
      {!loading && !error && logs.length === 0 && <EmptyState icon={ClipboardCheck} title="No audit history yet" description="Admin changes will appear here as they are made." />}
      {!loading && !error && logs.length > 0 && visibleLogs.length === 0 && <EmptyState icon={ClipboardCheck} title="No matching audit entries" description="Try a different filter or search term." />}
      {!loading && !error && visibleLogs.length > 0 && <div className="audit-table-wrap"><table className="audit-table"><thead><tr><th>Admin</th><th>Action</th><th>Module</th><th>Description</th><th>Timestamp</th></tr></thead><tbody>{visibleLogs.map((log) => <tr key={log.id}><td><span className="audit-admin"><ShieldCheck size={14} />{log.adminId || "Unknown"}</span></td><td><span className={`audit-action audit-action--${String(log.action || "").toLowerCase()}`}>{log.action || "Unknown"}</span></td><td>{log.module || "Unknown"}</td><td><span className="audit-description">{log.description || "No description"}</span>{log.recordId && <small className="audit-record">Record: {log.recordId}</small>}</td><td><span className="audit-time"><Clock3 size={14} />{formatDate(log.createdAt)}</span></td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}

export default AuditHistory;