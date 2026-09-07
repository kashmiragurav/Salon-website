import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getGalleryImages } from "../services/galleryService";
import { usePublicCollection } from "../hooks/useSalonData";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
import SafeImage from "../components/SafeImage";
const loadGallery = () => getGalleryImages();
function Gallery() {
	const state = usePublicCollection(loadGallery);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const selected = selectedIndex >= 0 ? state.data[selectedIndex] : null;

	useEffect(() => {
		if (!selected) return undefined;
		const handleKeyDown = (event) => {
			if (event.key === "Escape") setSelectedIndex(-1);
			if (event.key === "ArrowLeft") setSelectedIndex((index) => (index - 1 + state.data.length) % state.data.length);
			if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % state.data.length);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selected, state.data.length]);

	return <section className="section page-intro"><span className="eyebrow">The gallery</span><h1>A glimpse of the studio.</h1>{state.loading ? <LoadingState label="Loading gallery" /> : state.error ? <ErrorState /> : state.data.length ? <div className="gallery-grid">{state.data.map((image, index) => <figure className="gallery-tile" key={image.id}><button type="button" onClick={() => setSelectedIndex(index)} aria-label={`View ${image.caption || "salon image"}`}><SafeImage src={image.imageUrl} alt={image.caption || "Salon work"} /><span>View image</span></button><figcaption>{image.caption || image.category || ""}</figcaption></figure>)}</div> : <EmptyState message="Gallery images will appear here soon." />}{selected && <div className="lightbox" role="presentation" onClick={() => setSelectedIndex(-1)}><section className="lightbox__panel" role="dialog" aria-modal="true" aria-label={selected.caption || "Gallery image"} onClick={(event) => event.stopPropagation()}><button type="button" className="lightbox__close" onClick={() => setSelectedIndex(-1)} aria-label="Close image"><X size={20} /></button><button type="button" className="lightbox__previous" onClick={() => setSelectedIndex((index) => (index - 1 + state.data.length) % state.data.length)} aria-label="Previous image"><ChevronLeft size={24} /></button><SafeImage className="lightbox__image" src={selected.imageUrl} alt={selected.caption || "Salon work"} /><button type="button" className="lightbox__next" onClick={() => setSelectedIndex((index) => (index + 1) % state.data.length)} aria-label="Next image"><ChevronRight size={24} /></button><div className="lightbox__caption"><strong>{selected.caption || selected.category || "Salon work"}</strong></div></section></div>}</section>;
}

export default Gallery;