import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";

export default function ServiceCard({ service }) { return <article className="service-card"><SafeImage className="service-card__image" src={service.imageUrl} alt={service.name} /><div><span className="kicker">{service.category || "Signature service"}</span><h3>{service.name}</h3><p>{service.description || "A thoughtful experience shaped around you."}</p></div><div className="service-card__foot"><strong>{service.price != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(service.price)) : "Price on request"}</strong><span>{service.duration || "By consultation"}</span><Link className="icon-link" to={`/book-appointment?service=${encodeURIComponent(service.id)}`} aria-label={`Book ${service.name}`}><ArrowUpRight size={18} /></Link></div></article>; }
