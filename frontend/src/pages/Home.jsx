import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Award, Heart, ShieldCheck, Sparkles, MessageCircle, Clock3 } from "lucide-react";
import { usePublicCollection } from "../hooks/useSalonData";
import { getActiveServices } from "../services/serviceService";
import { getApprovedTestimonials } from "../services/testimonialService";
import { getActiveContent } from "../services/contentService";
import ServiceCard from "../components/ServiceCard";
import TestimonialList from "../components/TestimonialList";
import ReviewForm from "../components/ReviewForm";
import { ErrorState, LoadingState } from "../components/DataState";
import Reveal from "../components/Reveal";

function Home({ settings }) {
  const services = usePublicCollection(loadServices);
  const testimonials = usePublicCollection(loadTestimonials);
  const offers = usePublicCollection(loadOffers);
  const packages = usePublicCollection(loadPackages);
  const team = usePublicCollection(loadTeam);
  const beforeAfter = usePublicCollection(loadBeforeAfter);
  const faqs = usePublicCollection(loadFaqs);
  const salon = settings.data;
  return <>{settings.error && <ErrorState message="We could not load salon information. Please try again later." />}
    <section className="hero"><div className="hero__image" style={salon?.heroImageUrl ? { backgroundImage: `url(${salon.heroImageUrl})` } : undefined} /><div className="hero__content"><span className="eyebrow">{salon?.salonName || "Salon"}</span><h1>{salon?.heroTitle || "Your beauty, your confidence."}</h1><p>{salon?.heroDescription || "Professional beauty and wellness services designed around you."}</p><div className="hero__actions"><Link className="button" to="/book-appointment">Book an appointment <ArrowUpRight size={17} /></Link><Link className="hero__secondary-link" to="/services">Explore services</Link></div></div></section>
    <Reveal><section className="section intro"><div className="section-heading"><span className="eyebrow">The experience</span><h2>Where detail becomes a feeling.</h2></div><p className="lead">{salon?.aboutShortDescription || "A calm, personal space for considered colour, shape, and care."}</p></section></Reveal>
    <Reveal><section className="section reasons"><div className="section-heading"><span className="eyebrow">Why choose us</span><h2>Care you can feel from the first hello.</h2></div><div className="reason-grid">{[[Sparkles, "Professional experts", "Thoughtful advice and skilled hands, tailored to you."], [Award, "Premium products", "Quality products selected for beautiful, lasting results."], [Heart, "Personalized care", "Every appointment is shaped around your goals and comfort."], [ShieldCheck, "Hygiene & comfort", "A considered, calm environment where you can truly switch off."]].map(([Icon, title, copy]) => <article className="reason-card" key={title}><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}</div></section></Reveal>
    <Reveal><section className="section section--soft"><div className="section-heading"><span className="eyebrow">Our edit</span><h2>Signature services</h2><Link className="text-link" to="/services">View all <ArrowUpRight size={16} /></Link></div>{services.loading ? <LoadingState label="Loading services" /> : services.error ? <ErrorState /> : <div className="service-grid">{services.data.slice(0, 3).map((service) => <ServiceCard key={service.id} service={service} />)}</div>}</section></Reveal>
    <Reveal><section className="section stats">{[["yearsActive", "years of craft"], ["clientsServed", "clients welcomed"], ["staffCount", "talents in the team"]].map(([key, label]) => <div key={key}><strong>{salon?.[key] ?? "—"}</strong><span>{label}</span></div>)}</section></Reveal>
    {offers.data.length > 0 && <Reveal><section className="section section--soft"><div className="section-heading"><span className="eyebrow">Limited moments</span><h2>Special offers</h2></div><div className="content-cards">{offers.data.map((offer) => <article className="content-card" key={offer.id}><span className="kicker">Offer</span><h3>{offer.title}</h3><p>{offer.description}</p>{offer.offerPrice && <strong>₹{offer.offerPrice}</strong>}<Link className="text-link" to="/book-appointment">Book now <ArrowUpRight size={16} /></Link></article>)}</div></section></Reveal>}
    {packages.data.length > 0 && <Reveal><section className="section"><div className="section-heading"><span className="eyebrow">Curated combinations</span><h2>Beauty packages</h2></div><div className="content-cards">{packages.data.map((item) => <article className="content-card" key={item.id}><span className="kicker">Package</span><h3>{item.title}</h3><p>{item.description}</p><span>{item.servicesIncluded}</span>{item.price && <strong>₹{item.price}</strong>}</article>)}</div></section></Reveal>}
    {team.data.length > 0 && <Reveal><section className="section section--soft"><div className="section-heading"><span className="eyebrow">The people behind the care</span><h2>Meet our experts</h2></div><div className="content-cards">{team.data.map((person) => <article className="content-card" key={person.id}>{person.imageUrl && <img src={person.imageUrl} alt={person.name} />}<h3>{person.name}</h3><span>{person.role}</span><p>{person.specialization || person.bio}</p></article>)}</div></section></Reveal>}
    {beforeAfter.data.length > 0 && <Reveal><section className="section"><div className="section-heading"><span className="eyebrow">The transformation</span><h2>Before & after</h2></div><div className="content-cards">{beforeAfter.data.map((item) => <article className="content-card content-card--transform" key={item.id}><div><img src={item.beforeImageUrl} alt={`${item.title} before`} /><img src={item.afterImageUrl} alt={`${item.title} after`} /></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section></Reveal>}
    {faqs.data.length > 0 && <Reveal><section className="section section--soft"><div className="section-heading"><span className="eyebrow">Good to know</span><h2>Frequently asked questions</h2></div><div className="faq-list">{faqs.data.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section></Reveal>}
    <Reveal><section className="section salon-details"><div><span className="eyebrow">Visit us</span><h2>Make time for yourself.</h2><p>{salon?.address || "Our salon details are being updated."}</p>{salon?.phone && <a href={`tel:${salon.phone}`}><MessageCircle size={16} /> {salon.phone}</a>}</div><div className="salon-details__meta">{salon?.workingHours && <p><Clock3 size={18} /><span>{salon.workingHours}</span></p>}<Link className="button" to="/contact">Get in touch <ArrowUpRight size={17} /></Link></div></section></Reveal>
    <Reveal><section className="section"><div className="section-heading"><span className="eyebrow">Kind words</span><h2>From our clients</h2></div><TestimonialList {...testimonials} testimonials={testimonials.data} /><ReviewForm /></section></Reveal>
    <div className="floating-actions"><Link className="floating-book" to="/book-appointment">Book appointment <ArrowUpRight size={16} /></Link>{salon?.whatsappNumber && <a className="floating-whatsapp" href={`https://wa.me/${salon.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><MessageCircle size={21} /></a>}</div>
  </>;
}

const loadServices = () => getActiveServices();
const loadTestimonials = () => getApprovedTestimonials();
const loadOffers = () => getActiveContent("offers");
const loadPackages = () => getActiveContent("packages");
const loadTeam = () => getActiveContent("team");
const loadBeforeAfter = () => getActiveContent("beforeAfter");
const loadFaqs = () => getActiveContent("faqs");

export default Home;