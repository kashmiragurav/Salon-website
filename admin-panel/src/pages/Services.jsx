import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { formatDuration, parseDuration } from "../utils/duration";

const categories = ["Hair", "Skin", "Makeup", "Spa"];
const emptyForm = { name: "", category: "", description: "", price: "", hours: "", minutes: "", imageUrl: "" };

const validateForm = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.category) errors.category = "Category is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) <= 0) errors.price = "Enter a price greater than 0.";
  if (parseDuration(form.hours, form.minutes) <= 0) errors.duration = "Enter a duration greater than 0 minutes.";
  if (!form.imageUrl.trim()) errors.imageUrl = "Image URL is required.";
  else {
    try {
      const imageUrl = new URL(form.imageUrl);
      if (!['http:', 'https:'].includes(imageUrl.protocol)) errors.imageUrl = "Please enter a valid image URL.";
    } catch { errors.imageUrl = "Please enter a valid image URL."; }
  }
  return errors;
};

const formatPrice = (price) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(price) || 0);

function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
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

  const updateFilter = (name, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set(name, value.trim());
    else nextParams.delete(name);
    setSearchParams(nextParams);
  };

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
    const durationMinutes = Number(service.durationMinutes) || Number(String(service.duration || "").match(/\d+(?:\.\d+)?/)?.[0]) || 0;
    setForm({ name: service.name || "", category: service.category || "", description: service.description || "", price: String(service.price ?? ""), hours: String(Math.floor(durationMinutes / 60)), minutes: String(durationMinutes % 60), imageUrl: service.imageUrl || "" });
    setFormErrors({}); setActionError(""); setFormOpen(true);
  };
  const closeForm = () => { if (!saving) setFormOpen(false); };
  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    const nextErrors = validateForm(nextForm);
    setFormErrors((current) => ({ ...current, [name]: nextErrors[name], ...(name === "hours" || name === "minutes" ? { duration: nextErrors.duration } : {}) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true); setActionError("");
    try {
      const serviceData = { ...form, durationMinutes: parseDuration(form.hours, form.minutes) };
      if (editingService) await updateService(editingService.id, serviceData);
      else await createService(serviceData);
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
        <label className="search-field"><Search size={17} /><span className="sr-only">Search services</span><input value={search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search services" /></label>
        <label className="filter-field"><span>Category</span><select value={category} onChange={(event) => updateFilter("category", event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </section>

      <section className="services-list" aria-label="Services list">
        {loading && <LoadingSpinner label="Loading services" />}
        {!loading && !error && services.length === 0 && <EmptyState title="No services yet" description="Add your first service to build the catalogue." />}
        {!loading && !error && services.length > 0 && visibleServices.length === 0 && <EmptyState title="No matching services" description="Try a different search or category." />}
        {!loading && !error && visibleServices.length > 0 && (
          <div className="services-table-wrap"><table className="services-table"><thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {visibleServices.map((service) => <tr key={service.id}>
              <td><div className="service-cell">{service.imageUrl ? <img src={service.imageUrl} alt="" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "flex"; }} /> : null}<span className="service-image-placeholder" style={{ display: service.imageUrl ? "none" : "flex" }}><ImageOff size={17} /></span><div><strong>{service.name}</strong><span>{service.description}</span></div></div></td>
              <td>{service.category}</td><td>{formatPrice(service.price)}</td><td>{formatDuration(service.durationMinutes || service.duration)}</td>
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
  const hasPreview = form.imageUrl && !errors.imageUrl;
  return <div className="modal-backdrop" role="presentation"><section className="service-form-modal" role="dialog" aria-modal="true" aria-labelledby="service-form-title"><div className="modal-heading"><div><p className="eyebrow">Service catalogue</p><h2 id="service-form-title">{editing ? "Edit service" : "Add service"}</h2></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close service form"><X size={18} /></button></div><form onSubmit={onSubmit} noValidate>
    {field("name", "Name")}
    <label className="form-field"><span>Category</span><select name="category" value={form.category} onChange={onChange}><option value="">Select category</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>{errors.category && <small>{errors.category}</small>}</label>
    <div className="form-grid">{field("price", "Price", "number", { placeholder: "0.00" })}<div className="form-field"><span>Duration *</span><div className="duration-input"><input name="hours" type="number" min="0" step="1" value={form.hours} onChange={onChange} placeholder="Hours" aria-label="Duration hours" /><input name="minutes" type="number" min="0" max="59" step="1" value={form.minutes} onChange={onChange} placeholder="Minutes" aria-label="Duration minutes" /></div>{errors.duration && <small>{errors.duration}</small>}</div></div>
    <label className="form-field"><span>Description</span><textarea name="description" value={form.description} onChange={onChange} rows="3" />{errors.description && <small>{errors.description}</small>}</label>
    {field("imageUrl", "Image URL *", "url", { placeholder: "https://..." })}
    <div className="image-preview" aria-live="polite">{hasPreview ? <img src={form.imageUrl} alt="Service preview" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "block"; }} /> : null}<span style={{ display: hasPreview ? "none" : "block" }}>{errors.imageUrl || "Enter a valid image URL to preview it."}</span></div>
    <div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Add service"}</button></div>
  </form></section></div>;
}

export default Services;