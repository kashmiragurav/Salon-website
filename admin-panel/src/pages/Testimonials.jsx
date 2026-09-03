import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, MessageSquareQuote, Plus, Search, Star, Trash2, X } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  createTestimonial,
  deleteTestimonial,
  setTestimonialApproval,
  subscribeToTestimonials,
  updateTestimonial,
} from "../services/testimonialService";

const ratings = [1, 2, 3, 4, 5];
const emptyForm = { clientName: "", rating: "", reviewText: "", photoUrl: "" };

const validateForm = (form) => {
  const errors = {};
  if (!form.clientName.trim()) errors.clientName = "Client name is required.";
  if (!ratings.includes(Number(form.rating))) errors.rating = "Choose a rating from 1 to 5.";
  if (!form.reviewText.trim()) errors.reviewText = "Review text is required.";
  if (form.photoUrl.trim()) {
    try { new URL(form.photoUrl); } catch { errors.photoUrl = "Enter a valid image URL."; }
  }
  return errors;
};

function Rating({ value, large = false }) {
  return <span className={`rating${large ? " rating--large" : ""}`} aria-label={`${value} out of 5 stars`}>{ratings.map((rating) => <Star key={rating} size={large ? 18 : 14} fill={rating <= Number(value) ? "currentColor" : "none"} />)}</span>;
}

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials(
      (data) => { setTestimonials(data); setLoading(false); setError(""); },
      (testimonialError) => {
        console.error("Testimonials failed to load:", testimonialError);
        setError("We could not load testimonials from Firestore.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const visibleTestimonials = useMemo(() => {
    const term = search.trim().toLowerCase();
    return testimonials.filter((testimonial) => {
      const matchesSearch = !term || [testimonial.clientName, testimonial.reviewText].some((value) => String(value || "").toLowerCase().includes(term));
      const matchesFilter = filter === "all" || (filter === "approved" ? testimonial.isApproved === true : testimonial.isApproved !== true);
      return matchesSearch && matchesFilter;
    });
  }, [testimonials, search, filter]);

  const openAddForm = () => { setEditingTestimonial(null); setForm(emptyForm); setFormErrors({}); setActionError(""); setFormOpen(true); };
  const openEditForm = (testimonial) => {
    setEditingTestimonial(testimonial);
    setForm({ clientName: testimonial.clientName || "", rating: String(testimonial.rating || ""), reviewText: testimonial.reviewText || "", photoUrl: testimonial.photoUrl || "" });
    setFormErrors({}); setActionError(""); setFormOpen(true);
  };
  const closeForm = () => { if (!saving) setFormOpen(false); };
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true); setActionError("");
    try {
      if (editingTestimonial) await updateTestimonial(editingTestimonial.id, form);
      else await createTestimonial(form);
      setFormOpen(false);
    } catch (testimonialError) {
      console.error("Testimonial save failed:", testimonialError);
      setActionError("We could not save this testimonial. Please try again.");
    } finally { setSaving(false); }
  };

  const handleApproval = async (testimonial, isApproved) => {
    setActionError("");
    try { await setTestimonialApproval(testimonial.id, isApproved); }
    catch (testimonialError) { console.error("Testimonial approval failed:", testimonialError); setActionError("We could not update the approval status."); }
  };

  const handleDelete = async () => {
    setDeleting(true); setActionError("");
    try { await deleteTestimonial(deletingTestimonial.id); setDeletingTestimonial(null); }
    catch (testimonialError) { console.error("Testimonial delete failed:", testimonialError); setActionError("We could not delete this testimonial. Please try again."); }
    finally { setDeleting(false); }
  };

  return (
    <div className="testimonials-page">
      <header className="module-heading">
        <div><p className="eyebrow">Social proof</p><h1>Testimonials</h1><p>Review and approve the words your clients share.</p></div>
        <button type="button" className="button-primary" onClick={openAddForm}><Plus size={17} /> Add testimonial</button>
      </header>

      {actionError && <div className="module-error" role="alert">{actionError}<button type="button" onClick={() => setActionError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
      {error && <div className="module-error" role="alert">{error}</div>}

      <section className="service-toolbar" aria-label="Testimonial filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search testimonials</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client or review" /></label>
        <label className="filter-field"><span>Status</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All testimonials</option><option value="approved">Approved</option><option value="pending">Pending</option></select></label>
      </section>

      <section className="testimonials-list" aria-label="Testimonials list">
        {loading && <LoadingSpinner label="Loading testimonials" />}
        {!loading && !error && testimonials.length === 0 && <EmptyState icon={MessageSquareQuote} title="No testimonials yet" description="Add a client review to start building social proof." />}
        {!loading && !error && testimonials.length > 0 && visibleTestimonials.length === 0 && <EmptyState icon={MessageSquareQuote} title="No matching testimonials" description="Try a different search or approval filter." />}
        {!loading && !error && visibleTestimonials.length > 0 && <div className="testimonials-table-wrap"><table className="testimonials-table"><thead><tr><th>Client</th><th>Rating</th><th>Review</th><th>Approval status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {visibleTestimonials.map((testimonial) => <tr key={testimonial.id}>
            <td><div className="testimonial-client">{testimonial.photoUrl ? <img src={testimonial.photoUrl} alt="" /> : <span>{String(testimonial.clientName || "?").charAt(0).toUpperCase()}</span>}<strong>{testimonial.clientName || "Unnamed client"}</strong></div></td>
            <td><Rating value={testimonial.rating} /></td>
            <td><p className="review-text">{testimonial.reviewText}</p></td>
            <td><span className={`approval-badge ${testimonial.isApproved === true ? "is-approved" : "is-pending"}`}>{testimonial.isApproved === true ? "Approved" : "Pending"}</span></td>
            <td><div className="testimonial-actions">{testimonial.isApproved === true ? <button type="button" className="approval-action approval-action--reject" onClick={() => handleApproval(testimonial, false)}><X size={14} /> Reject</button> : <button type="button" className="approval-action approval-action--approve" onClick={() => handleApproval(testimonial, true)}><Check size={14} /> Approve</button>}<button type="button" className="table-action" onClick={() => openEditForm(testimonial)} aria-label={`Edit ${testimonial.clientName || "testimonial"}`}><Edit3 size={16} /></button><button type="button" className="table-action table-action--danger" onClick={() => setDeletingTestimonial(testimonial)} aria-label={`Delete ${testimonial.clientName || "testimonial"}`}><Trash2 size={16} /></button></div></td>
          </tr>)}
        </tbody></table></div>}
      </section>

      {formOpen && <TestimonialForm form={form} errors={formErrors} saving={saving} editing={Boolean(editingTestimonial)} onChange={handleChange} onSubmit={handleSubmit} onClose={closeForm} />}
      {deletingTestimonial && <ConfirmModal title="Delete this testimonial?" message={`This will permanently remove ${deletingTestimonial.clientName || "this review"}.`} onConfirm={handleDelete} onCancel={() => !deleting && setDeletingTestimonial(null)} loading={deleting} />}
    </div>
  );
}

function TestimonialForm({ form, errors, saving, editing, onChange, onSubmit, onClose }) {
  return <div className="modal-backdrop" role="presentation"><section className="service-form-modal" role="dialog" aria-modal="true" aria-labelledby="testimonial-form-title"><div className="modal-heading"><div><p className="eyebrow">Social proof</p><h2 id="testimonial-form-title">{editing ? "Edit testimonial" : "Add testimonial"}</h2></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close testimonial form"><X size={18} /></button></div><form onSubmit={onSubmit} noValidate>
    <label className="form-field"><span>Client name</span><input name="clientName" value={form.clientName} onChange={onChange} />{errors.clientName && <small>{errors.clientName}</small>}</label>
    <label className="form-field"><span>Rating</span><select name="rating" value={form.rating} onChange={onChange}><option value="">Select rating</option>{ratings.map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>)}</select>{errors.rating && <small>{errors.rating}</small>}</label>
    <label className="form-field"><span>Review</span><textarea name="reviewText" value={form.reviewText} onChange={onChange} rows="5" />{errors.reviewText && <small>{errors.reviewText}</small>}</label>
    <label className="form-field"><span>Photo URL (optional)</span><input name="photoUrl" type="url" value={form.photoUrl} onChange={onChange} placeholder="https://..." />{errors.photoUrl && <small>{errors.photoUrl}</small>}</label>
    <div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Add testimonial"}</button></div>
  </form></section></div>;
}

export default Testimonials;