import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }) { return <article className="service-card"><div><span className="kicker">{service.category || "Signature service"}</span><h3>{service.name}</h3><p>{service.description || "A thoughtful experience shaped around you."}</p></div><div className="service-card__foot"><strong>{service.price != null ? new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(Number(service.price)) : "Price on request"}</strong><span>{service.duration || "By consultation"}</span><Link className="icon-link" to="/book-appointment" aria-label={`Book ${service.name}`}><ArrowUpRight size={18} /></Link></div></article>; }
