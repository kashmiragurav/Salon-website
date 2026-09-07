import { getGalleryImages } from "../services/galleryService";
import { usePublicCollection } from "../hooks/useSalonData";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
import SafeImage from "../components/SafeImage";
const loadGallery = () => getGalleryImages();
function Gallery() { const state = usePublicCollection(loadGallery); return <section className="section page-intro"><span className="eyebrow">The gallery</span><h1>A glimpse of the studio.</h1>{state.loading ? <LoadingState label="Loading gallery" /> : state.error ? <ErrorState /> : state.data.length ? <div className="gallery-grid">{state.data.map((image) => <figure key={image.id}><SafeImage src={image.imageUrl} alt={image.caption || "Salon work"} /><figcaption>{image.caption || image.category || ""}</figcaption></figure>)}</div> : <EmptyState message="Gallery images will appear here soon." />}</section>; }

export default Gallery;