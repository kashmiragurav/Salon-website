import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Image as ImageIcon, Search, Trash2, Upload, X } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { MAX_IMAGE_SIZE, addGalleryImage, deleteGalleryImage, subscribeToGallery } from "../services/galleryService";

const categories = ["Hair", "Skin", "Makeup", "Spa", "Other"];

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formCategory, setFormCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

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

  const visibleImages = useMemo(() => {
    const term = search.trim().toLowerCase();
    return images.filter((image) => {
      const matchesSearch = !term || [image.caption, image.category].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesSearch && (!category || image.category === category);
    });
  }, [images, search, category]);

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false); setSelectedFile(null); setFormCategory(""); setCaption(""); setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFormError("");
    if (!file) { setSelectedFile(null); return; }
    if (!file.type.startsWith("image/")) { setSelectedFile(null); setFormError("Only image files are allowed."); return; }
    if (file.size > MAX_IMAGE_SIZE) { setSelectedFile(null); setFormError("Images must be 10 MB or smaller."); return; }
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) { setFormError("Please select an image."); return; }
    setSaving(true); setFormError("");
    try { await addGalleryImage({ file: selectedFile, category: formCategory, caption }); closeForm(); }
    catch (galleryError) { console.error("Gallery upload failed:", galleryError); setFormError(galleryError.message || "We could not upload this image. Please try again."); }
    finally { setSaving(false); }
  };

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
        <button type="button" className="button-primary" onClick={() => { setFormError(""); setFormOpen(true); }}><ImagePlus size={17} /> Add image</button>
      </header>

      {error && <div className="module-error" role="alert">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div>}

      <section className="service-toolbar" aria-label="Gallery filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search gallery</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search gallery" /></label>
        <label className="filter-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </section>

      <section className="gallery-list" aria-label="Gallery images">
        {loading && <LoadingSpinner label="Loading gallery" />}
        {!loading && !error && images.length === 0 && <EmptyState icon={ImageIcon} title="No gallery images yet" description="Add an image to start building your visual library." />}
        {!loading && !error && images.length > 0 && visibleImages.length === 0 && <EmptyState icon={ImageIcon} title="No matching images" description="Try a different search or category." />}
        {!loading && !error && visibleImages.length > 0 && <div className="gallery-grid">{visibleImages.map((image) => <article className="gallery-card" key={image.id}>
          <div className="gallery-card__image"><img src={image.imageUrl} alt={image.caption || `${image.category || "Gallery"} image`} onError={(event) => { event.currentTarget.style.display = "none"; }} /><span className="gallery-card__fallback"><ImageIcon size={25} /></span></div>
          <div className="gallery-card__body"><div><span className="gallery-category">{image.category || "Uncategorized"}</span><h2>{image.caption || "Untitled image"}</h2><p>{formatDate(image.uploadedAt)}</p></div><button type="button" className="table-action table-action--danger" onClick={() => setDeletingImage(image)} aria-label={`Delete ${image.caption || "gallery image"}`}><Trash2 size={16} /></button></div>
        </article>)}</div>}
      </section>

      {formOpen && <div className="modal-backdrop" role="presentation"><section className="service-form-modal gallery-form-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-form-title"><div className="modal-heading"><div><p className="eyebrow">Visual library</p><h2 id="gallery-form-title">Add gallery image</h2></div><button type="button" className="modal-close" onClick={closeForm} aria-label="Close upload form"><X size={18} /></button></div><form onSubmit={handleSubmit} noValidate>
        <label className="upload-dropzone"><Upload size={22} /><strong>{selectedFile ? selectedFile.name : "Choose an image"}</strong><span>JPG, PNG, WEBP or GIF up to 10 MB</span><input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} /></label>
        <label className="form-field"><span>Category (optional)</span><select value={formCategory} onChange={(event) => setFormCategory(event.target.value)}><option value="">Uncategorized</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="form-field"><span>Caption (optional)</span><input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength="160" placeholder="Describe this image" /></label>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="modal-actions"><button type="button" className="button-secondary" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Uploading..." : "Upload image"}</button></div>
      </form></section></div>}
      {deletingImage && <ConfirmModal title="Delete this image?" message="The gallery record and its stored image will be removed." onConfirm={handleDelete} onCancel={() => !deleting && setDeletingImage(null)} loading={deleting} />}
    </div>
  );
}

export default Gallery;