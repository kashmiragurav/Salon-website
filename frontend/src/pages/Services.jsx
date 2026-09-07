import { useState } from "react";
import { getActiveServices } from "../services/serviceService";
import { usePublicCollection } from "../hooks/useSalonData";
import ServiceCard from "../components/ServiceCard";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
const loadServices = () => getActiveServices();
function Services() { const state = usePublicCollection(loadServices); const [category, setCategory] = useState("All"); const categories = ["All", ...new Set(state.data.map((service) => service.category).filter(Boolean))]; const visible = state.data.filter((service) => category === "All" || service.category === category); return <section className="section page-intro"><span className="eyebrow">The menu</span><h1>Services shaped around you.</h1>{state.loading ? <LoadingState label="Loading services" /> : state.error ? <ErrorState /> : state.data.length ? <><div className="appointment-tabs" role="tablist" aria-label="Service categories">{categories.map((item) => <button type="button" role="tab" aria-selected={category === item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>{visible.length ? <div className="service-grid">{visible.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <EmptyState message="No services in this category." />}</> : <EmptyState message="Services will appear here soon." />}</section>; }

export default Services;