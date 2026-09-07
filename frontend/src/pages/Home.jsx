import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Award, Heart, ShieldCheck, Sparkles, MessageCircle, Clock3 } from "lucide-react";
import { usePublicCollection } from "../hooks/useSalonData";
import { getActiveServices } from "../services/serviceService";
import { getApprovedTestimonials } from "../services/testimonialService";
import ServiceCard from "../components/ServiceCard";
import TestimonialList from "../components/TestimonialList";
import ReviewForm from "../components/ReviewForm";
import { ErrorState, LoadingState } from "../components/DataState";
import Reveal from "../components/Reveal";

function Home({ settings }) {
  const services = usePublicCollection(loadServices);
  const testimonials = usePublicCollection(loadTestimonials);
  const salon = settings.data;
  return <>{settings.error && <ErrorState message="We could not load salon information. Please try again later." />}
    <section className="hero"><div className="hero__image" style={salon?.heroImageUrl ? { backgroundImage: `url(${salon.heroImageUrl})` } : undefined} /><div className="hero__content"><span className="eyebrow">{salon?.salonName || "Salon"}</span><h1>{salon?.heroTitle || "Your beauty, your confidence."}</h1><p>{salon?.heroDescription || "Professional beauty and wellness services designed around you."}</p><div className="hero__actions"><Link className="button" to="/book-appointment">Book an appointment <ArrowUpRight size={17} /></Link><Link className="hero__secondary-link" to="/services">Explore services</Link></div></div></section>
    <Reveal><section className="section intro"><div className="section-heading"><span className="eyebrow">The experience</span><h2>Where detail becomes a feeling.</h2></div><p className="lead">{salon?.aboutShortDescription || "A calm, personal space for considered colour, shape, and care."}</p></section></Reveal>
    <Reveal><section className="section reasons"><div className="section-heading"><span className="eyebrow">Why choose us</span><h2>Care you can feel from the first hello.</h2></div><div className="reason-grid">{[[Sparkles, "Professional experts", "Thoughtful advice and skilled hands, tailored to you."], [Award, "Premium products", "Quality products selected for beautiful, lasting results."], [Heart, "Personalized care", "Every appointment is shaped around your goals and comfort."], [ShieldCheck, "Hygiene & comfort", "A considered, calm environment where you can truly switch off."]].map(([Icon, title, copy]) => <article className="reason-card" key={title}><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}</div></section></Reveal>
    <Reveal><section className="section section--soft"><div className="section-heading"><span className="eyebrow">Our edit</span><h2>Signature services</h2><Link className="text-link" to="/services">View all <ArrowUpRight size={16} /></Link></div>{services.loading ? <LoadingState label="Loading services" /> : services.error ? <ErrorState /> : <div className="service-grid">{services.data.slice(0, 3).map((service) => <ServiceCard key={service.id} service={service} />)}</div>}</section></Reveal>
    <Reveal><section className="section stats">{[["yearsActive", "years of craft"], ["clientsServed", "clients welcomed"], ["staffCount", "talents in the team"]].map(([key, label]) => <div key={key}><strong>{salon?.[key] ?? "—"}</strong><span>{label}</span></div>)}</section></Reveal>
    <Reveal><section className="section salon-details"><div><span className="eyebrow">Visit us</span><h2>Make time for yourself.</h2><p>{salon?.address || "Our salon details are being updated."}</p>{salon?.phone && <a href={`tel:${salon.phone}`}><MessageCircle size={16} /> {salon.phone}</a>}</div><div className="salon-details__meta">{salon?.workingHours && <p><Clock3 size={18} /><span>{salon.workingHours}</span></p>}<Link className="button" to="/contact">Get in touch <ArrowUpRight size={17} /></Link></div></section></Reveal>
    <Reveal><section className="section"><div className="section-heading"><span className="eyebrow">Kind words</span><h2>From our clients</h2></div><TestimonialList {...testimonials} testimonials={testimonials.data} /><ReviewForm /></section></Reveal>
    <div className="floating-actions"><Link className="floating-book" to="/book-appointment">Book appointment <ArrowUpRight size={16} /></Link>{salon?.whatsappNumber && <a className="floating-whatsapp" href={`https://wa.me/${salon.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><MessageCircle size={21} /></a>}</div>
  </>;
}

const loadServices = () => getActiveServices();
const loadTestimonials = () => getApprovedTestimonials();

export default Home;