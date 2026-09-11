import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Image as ImageIcon, Search, Trash2, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { addGalleryImage, deleteGalleryImage, subscribeToGallery, updateGalleryImage } from "../services/galleryService";

const categories = ["Hair", "Skin", "Makeup", "Spa", "Other"];

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const [formOpen, setFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToGallery(
      (data) => { setImages(data); setLoading(false); setError(""); },
      (galleryError) => {
        console.error("Gallery failed to load:", galleryError);
        setError("We could not load gallery images from Firestore.");
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

  const visibleImages = useMemo(() => {
    const term = search.trim().toLowerCase();
    return images.filter((image) => {
      const matchesSearch = !term || [image.caption, image.category].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesSearch && (!category || image.category === category);
    });
  }, [images, search, category]);

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false); setEditingImage(null); setImageUrl(""); setPreviewError(false); setFormCategory(""); setCaption(""); setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageUrl.trim()) { setFormError("Image URL is required."); return; }
    if (previewError) { setFormError("Unable to load image. Please check the URL."); return; }
    setSaving(true); setFormError("");
    try { if (editingImage) { await updateGalleryImage(editingImage.id, { imageUrl, category: formCategory, caption }); setSuccess("Gallery image updated successfully."); } else { await addGalleryImage({ imageUrl, category: formCategory, caption }); setSuccess("Gallery image added successfully."); } closeForm(); }
    catch (galleryError) { console.error("Gallery upload failed:", galleryError); setFormError(galleryError.message || "We could not upload this image. Please try again."); }
    finally { setSaving(false); }
  };

  const openAddForm = () => { setEditingImage(null); setImageUrl(""); setPreviewError(false); setFormCategory(""); setCaption(""); setFormError(""); setFormOpen(true); };
  const openEditForm = (image) => { setEditingImage(image); setImageUrl(image.imageUrl || ""); setPreviewError(false); setFormCategory(image.category || ""); setCaption(image.caption || ""); setFormError(""); setFormOpen(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteGalleryImage(deletingImage); setDeletingImage(null); }
    catch (galleryError) { console.error("Gallery delete failed:", galleryError); setError("We could not delete this image. Please try again."); }
    finally { setDeleting(false); }
  };

  return (
    <div className="gallery-page">
      <header className="module-heading">
        <div><p className="eyebrow">Visual library</p><h1>Gallery</h1><p>Curate the images that represent your salon.</p></div>
        <button type="button" className="button-primary" onClick={openAddForm}><ImagePlus size={17} /> Add image</button>
      </header>

      {error && <div className="module-error" role="alert">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div>}{success && <div className="settings-success" role="status">{success}</div>}

      <section className="service-toolbar" aria-label="Gallery filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search gallery</span><input value={search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search gallery" /></label>
        <label className="filter-field"><span>Category</span><select value={category} onChange={(event) => updateFilter("category", event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </section>

      <section className="gallery-list" aria-label="Gallery images">
        {loading && <LoadingSpinner label="Loading gallery" />}
        {!loading && !error && images.length === 0 && <EmptyState icon={ImageIcon} title="No gallery images yet" description="Add an image to start building your visual library." />}
        {!loading && !error && images.length > 0 && visibleImages.length === 0 && <EmptyState icon={ImageIcon} title="No matching images" description="Try a different search or category." />}
        {!loading && !error && visibleImages.length > 0 && <div className="gallery-grid">{visibleImages.map((image) => <article className="gallery-card" key={image.id}>
          <div className="gallery-card__image"><img src={image.imageUrl} alt={image.caption || `${image.category || "Gallery"} image`} onError={(event) => { event.currentTarget.style.display = "none"; }} /><span className="gallery-card__fallback"><ImageIcon size={25} /></span></div>
          <div className="gallery-card__body"><div><span className="gallery-category">{image.category || "Uncategorized"}</span><h2>{image.caption || "Untitled image"}</h2><p>{formatDate(image.uploadedAt)}</p></div><div className="service-actions"><button type="button" className="table-action" onClick={() => openEditForm(image)} aria-label={`Edit ${image.caption || "gallery image"}`}>Edit</button><button type="button" className="table-action table-action--danger" onClick={() => setDeletingImage(image)} aria-label={`Delete ${image.caption || "gallery image"}`}><Trash2 size={16} /></button></div></div>
        </article>)}</div>}
      </section>

      {formOpen && <div className="modal-backdrop" role="presentation"><section className="service-form-modal gallery-form-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-form-title"><div className="modal-heading"><div><p className="eyebrow">Visual library</p><h2 id="gallery-form-title">{editingImage ? "Edit gallery image" : "Add gallery image"}</h2></div><button type="button" className="modal-close" onClick={closeForm} aria-label="Close gallery form"><X size={18} /></button></div><form onSubmit={handleSubmit} noValidate>
        <label className="form-field"><span>Image URL *</span><input type="url" value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); setPreviewError(false); setFormError(""); }} placeholder="https://example.com/image.jpg" />{formError && <small>{formError}</small>}</label>{imageUrl && <div className="image-preview"><img src={imageUrl} alt="Gallery preview" onLoad={() => setPreviewError(false)} onError={(event) => { setPreviewError(true); event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "block"; }} /><span style={{ display: "none" }}>Unable to load image. Please check the URL.</span></div>}
        <label className="form-field"><span>Category (optional)</span><select value={formCategory} onChange={(event) => setFormCategory(event.target.value)}><option value="">Uncategorized</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="form-field"><span>Caption (optional)</span><input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength="160" placeholder="Describe this image" /></label>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="modal-actions"><button type="button" className="button-secondary" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving..." : editingImage ? "Save changes" : "Add gallery image"}</button></div>
      </form></section></div>}
      {deletingImage && <ConfirmModal title="Delete this image?" message="The gallery record and its stored image will be removed." onConfirm={handleDelete} onCancel={() => !deleting && setDeletingImage(null)} loading={deleting} />}
    </div>
  );
}

export default Gallery;