import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, Eye, Mail, MessageSquareText, Phone, Search, UserRound, X } from "lucide-react";

import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { ENQUIRY_STATUSES, subscribeToEnquiries, updateEnquiryStatus } from "../services/enquiryService";

const statusKey = (status) => String(status || "NEW").toLowerCase();

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
};

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToEnquiries(
      (data) => { setEnquiries(data); setLoading(false); setError(""); },
      (enquiryError) => {
        console.error("Enquiries failed to load:", enquiryError);
        setError("We could not load enquiries from Firestore.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const visibleEnquiries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesSearch = !term || [enquiry.name, enquiry.email, enquiry.phone, enquiry.subject, enquiry.message].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesSearch && (!statusFilter || statusKey(enquiry.status) === statusFilter.toLowerCase());
    });
  }, [enquiries, search, statusFilter]);

  const changeStatus = async (enquiry, status) => {
    setUpdatingId(enquiry.id); setActionError("");
    try { await updateEnquiryStatus(enquiry.id, status); setSelectedEnquiry(null); }
    catch (enquiryError) { console.error("Enquiry status update failed:", enquiryError); setActionError("We could not update this enquiry. Please try again."); }
    finally { setUpdatingId(""); }
  };

  return (
    <div className="enquiries-page">
      <header className="module-heading"><div><p className="eyebrow">Client conversations</p><h1>Enquiries</h1><p>Read, respond to, and close incoming messages.</p></div></header>
      {actionError && <div className="module-error" role="alert">{actionError}<button type="button" onClick={() => setActionError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
      {error && <div className="module-error" role="alert">{error}</div>}

      <section className="service-toolbar" aria-label="Enquiry filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search enquiries</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or subject" /></label>
        <label className="filter-field"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{ENQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
      </section>

      <section className="enquiries-list" aria-label="Enquiries list">
        {loading && <LoadingSpinner label="Loading enquiries" />}
        {!loading && !error && enquiries.length === 0 && <EmptyState icon={MessageSquareText} title="No enquiries yet" description="Incoming contact messages will appear here." />}
        {!loading && !error && enquiries.length > 0 && visibleEnquiries.length === 0 && <EmptyState icon={MessageSquareText} title="No matching enquiries" description="Try a different search or status filter." />}
        {!loading && !error && visibleEnquiries.length > 0 && <div className="enquiries-table-wrap"><table className="enquiries-table"><thead><tr><th>Client</th><th>Subject</th><th>Received</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {visibleEnquiries.map((enquiry) => <tr key={enquiry.id}>
            <td><div className="enquiry-client"><span><UserRound size={16} /></span><div><strong>{enquiry.name || "Unnamed sender"}</strong><small>{enquiry.email || enquiry.phone || "No contact provided"}</small></div></div></td>
            <td><span className="enquiry-subject">{enquiry.subject || "No subject"}</span><small className="enquiry-preview">{enquiry.message || "No message"}</small></td>
            <td>{formatDate(enquiry.createdAt)}</td><td><span className={`enquiry-status enquiry-status--${statusKey(enquiry.status)}`}>{enquiry.status || "NEW"}</span></td>
            <td><button type="button" className="view-details-button" onClick={() => setSelectedEnquiry(enquiry)}><Eye size={15} /> View message</button></td>
          </tr>)}
        </tbody></table></div>}
      </section>

      {selectedEnquiry && <EnquiryDetails enquiry={selectedEnquiry} updating={updatingId === selectedEnquiry.id} onClose={() => setSelectedEnquiry(null)} onChangeStatus={(status) => changeStatus(selectedEnquiry, status)} />}
    </div>
  );
}

function EnquiryDetails({ enquiry, updating, onClose, onChangeStatus }) {
  const currentStatus = String(enquiry.status || "NEW").toUpperCase();
  return <div className="modal-backdrop" role="presentation"><section className="enquiry-details-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-details-title"><div className="modal-heading"><div><p className="eyebrow">Enquiry details</p><h2 id="enquiry-details-title">{enquiry.subject || "Message"}</h2></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close enquiry details"><X size={18} /></button></div><div className="enquiry-detail-client"><span><UserRound size={17} /></span><div><strong>{enquiry.name || "Unnamed sender"}</strong><p>{enquiry.email || "No email provided"}</p></div></div><dl className="enquiry-contact-grid"><div><dt><Mail size={14} /> Email</dt><dd>{enquiry.email || "Not provided"}</dd></div><div><dt><Phone size={14} /> Phone</dt><dd>{enquiry.phone || "Not provided"}</dd></div><div><dt><Clock3 size={14} /> Received</dt><dd>{formatDate(enquiry.createdAt)}</dd></div></dl><div className="enquiry-message"><span>Message</span><p>{enquiry.message || "No message provided."}</p></div><div className="enquiry-workflow"><span>Change status</span><div>{ENQUIRY_STATUSES.map((status) => <button type="button" key={status} className={`enquiry-status-button enquiry-status-button--${statusKey(status)} ${currentStatus === status ? "is-current" : ""}`} onClick={() => onChangeStatus(status)} disabled={updating || currentStatus === status}>{currentStatus === status && <Check size={14} />}{status}</button>)}</div></div></section></div>;
}

export default Enquiries;