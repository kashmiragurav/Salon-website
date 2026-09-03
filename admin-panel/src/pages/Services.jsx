import { useEffect, useMemo, useState } from "react";
import { Edit3, ImageOff, Plus, Search, Trash2, X } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  createService,
  deleteService,
  setServiceActive,
  subscribeToServices,
  updateService,
} from "../services/serviceService";

const categories = ["Hair", "Skin", "Makeup", "Spa"];
const emptyForm = { name: "", category: "", description: "", price: "", duration: "", imageUrl: "" };

const validateForm = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.category) errors.category = "Category is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0) errors.price = "Enter a price of 0 or more.";
  if (!form.duration.trim()) errors.duration = "Duration is required.";
  return errors;
};

const formatPrice = (price) => new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(Number(price) || 0);

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deletingService, setDeletingService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToServices(
      (data) => { setServices(data); setLoading(false); setError(""); },
      (servicesError) => {
        console.error("Services failed to load:", servicesError);
        setError("We could not load services from Firestore.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const visibleServices = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchesSearch = !searchTerm || [service.name, service.description, service.category].some((value) => String(value || "").toLowerCase().includes(searchTerm));
      return matchesSearch && (!category || service.category === category);
    });
  }, [services, search, category]);

  const openAddForm = () => { setEditingService(null); setForm(emptyForm); setFormErrors({}); setActionError(""); setFormOpen(true); };
  const openEditForm = (service) => {
    setEditingService(service);
    setForm({ name: service.name || "", category: service.category || "", description: service.description || "", price: String(service.price ?? ""), duration: service.duration || "", imageUrl: service.imageUrl || "" });
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
      if (editingService) await updateService(editingService.id, form);
      else await createService(form);
      setFormOpen(false);
    } catch (serviceError) {
      console.error("Service save failed:", serviceError);
      setActionError("We could not save this service. Please try again.");
    } finally { setSaving(false); }
  };

  const handleToggle = async (service) => {
    setActionError("");
    try { await setServiceActive(service.id, service.isActive !== true); }
    catch (serviceError) { console.error("Service status update failed:", serviceError); setActionError("We could not update this service status."); }
  };

  const handleDelete = async () => {
    setDeleting(true); setActionError("");
    try { await deleteService(deletingService.id); setDeletingService(null); }
    catch (serviceError) { console.error("Service delete failed:", serviceError); setActionError("We could not delete this service. Please try again."); }
    finally { setDeleting(false); }
  };

  return (
    <div className="services-page">
      <header className="module-heading">
        <div><p className="eyebrow">Service catalogue</p><h1>Services</h1><p>Keep your service menu current and ready to share.</p></div>
        <button type="button" className="button-primary" onClick={openAddForm}><Plus size={17} /> Add service</button>
      </header>

      {actionError && <div className="module-error" role="alert">{actionError}<button type="button" onClick={() => setActionError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
      {error && <div className="module-error" role="alert">{error}</div>}

      <section className="service-toolbar" aria-label="Service filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search services</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" /></label>
        <label className="filter-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </section>

      <section className="services-list" aria-label="Services list">
        {loading && <LoadingSpinner label="Loading services" />}
        {!loading && !error && services.length === 0 && <EmptyState title="No services yet" description="Add your first service to build the catalogue." />}
        {!loading && !error && services.length > 0 && visibleServices.length === 0 && <EmptyState title="No matching services" description="Try a different search or category." />}
        {!loading && !error && visibleServices.length > 0 && (
          <div className="services-table-wrap"><table className="services-table"><thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {visibleServices.map((service) => <tr key={service.id}>
              <td><div className="service-cell">{service.imageUrl ? <img src={service.imageUrl} alt="" /> : <span className="service-image-placeholder"><ImageOff size={17} /></span>}<div><strong>{service.name}</strong><span>{service.description}</span></div></div></td>
              <td>{service.category}</td><td>{formatPrice(service.price)}</td><td>{service.duration}</td>
              <td><button type="button" className={`active-toggle ${service.isActive === true ? "is-active" : ""}`} onClick={() => handleToggle(service)} aria-pressed={service.isActive === true}><span />{service.isActive === true ? "Active" : "Inactive"}</button></td>
              <td><div className="service-actions"><button type="button" className="table-action" onClick={() => openEditForm(service)} aria-label={`Edit ${service.name}`}><Edit3 size={16} /></button><button type="button" className="table-action table-action--danger" onClick={() => setDeletingService(service)} aria-label={`Delete ${service.name}`}><Trash2 size={16} /></button></div></td>
            </tr>)}
          </tbody></table></div>
        )}
      </section>

      {formOpen && <ServiceForm form={form} errors={formErrors} saving={saving} editing={Boolean(editingService)} onChange={handleChange} onSubmit={handleSubmit} onClose={closeForm} />}
      {deletingService && <ConfirmModal title="Delete this service?" message={`This will permanently remove ${deletingService.name} from your catalogue.`} onConfirm={handleDelete} onCancel={() => !deleting && setDeletingService(null)} loading={deleting} />}
    </div>
  );
}

function ServiceForm({ form, errors, saving, editing, onChange, onSubmit, onClose }) {
  const field = (name, label, type = "text", extra = {}) => <label className="form-field"><span>{label}</span><input name={name} type={type} value={form[name]} onChange={onChange} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} {...extra} />{errors[name] && <small>{errors[name]}</small>}</label>;
  return <div className="modal-backdrop" role="presentation"><section className="service-form-modal" role="dialog" aria-modal="true" aria-labelledby="service-form-title"><div className="modal-heading"><div><p className="eyebrow">Service catalogue</p><h2 id="service-form-title">{editing ? "Edit service" : "Add service"}</h2></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close service form"><X size={18} /></button></div><form onSubmit={onSubmit} noValidate>
    {field("name", "Name")}
    <label className="form-field"><span>Category</span><select name="category" value={form.category} onChange={onChange}><option value="">Select category</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>{errors.category && <small>{errors.category}</small>}</label>
    <div className="form-grid">{field("price", "Price", "number", { placeholder: "0.00" })}{field("duration", "Duration", "text", { placeholder: "e.g. 60 min" })}</div>
    <label className="form-field"><span>Description</span><textarea name="description" value={form.description} onChange={onChange} rows="3" />{errors.description && <small>{errors.description}</small>}</label>
    {field("imageUrl", "Image URL (optional)", "url", { placeholder: "https://..." })}
    <div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Add service"}</button></div>
  </form></section></div>;
}

export default Services;