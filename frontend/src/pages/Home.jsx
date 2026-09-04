import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { usePublicCollection } from "../hooks/useSalonData";
import { getActiveServices } from "../services/serviceService";
import { getApprovedTestimonials } from "../services/testimonialService";
import ServiceCard from "../components/ServiceCard";
import TestimonialList from "../components/TestimonialList";
import { ErrorState, LoadingState } from "../components/DataState";

function Home({ settings }) {
  const services = usePublicCollection(loadServices);
  const testimonials = usePublicCollection(loadTestimonials);
  const salon = settings.data;
  return <>{settings.error && <ErrorState message="We could not load salon information. Please try again later." />}
    <section className="hero"><div className="hero__image" style={salon?.heroImageUrl ? { backgroundImage: `url(${salon.heroImageUrl})` } : undefined} /><div className="hero__content"><span className="eyebrow">{salon?.salonName || "Salon"}</span><h1>{salon?.heroTitle || ""}</h1><p>{salon?.heroDescription || ""}</p><Link className="button" to="/book-appointment">Book an appointment <ArrowUpRight size={17} /></Link></div></section>
    <section className="section intro"><div className="section-heading"><span className="eyebrow">The experience</span><h2>Where detail becomes a feeling.</h2></div><p className="lead">A calm, personal space for considered colour, shape, and care.</p></section>
    <section className="section section--soft"><div className="section-heading"><span className="eyebrow">Our edit</span><h2>Signature services</h2><Link className="text-link" to="/services">View all <ArrowUpRight size={16} /></Link></div>{services.loading ? <LoadingState label="Loading services" /> : services.error ? <ErrorState /> : <div className="service-grid">{services.data.slice(0, 3).map((service) => <ServiceCard key={service.id} service={service} />)}</div>}</section>
    <section className="section stats">{[["yearsActive", "years of craft"], ["clientsServed", "clients welcomed"], ["staffCount", "talents in the team"]].map(([key, label]) => <div key={key}><strong>{salon?.[key] ?? "—"}</strong><span>{label}</span></div>)}</section>
    <section className="section"><div className="section-heading"><span className="eyebrow">Kind words</span><h2>From our clients</h2></div><TestimonialList {...testimonials} testimonials={testimonials.data} /></section>
  </>;
}

const loadServices = () => getActiveServices();
const loadTestimonials = () => getApprovedTestimonials();

export default Home;