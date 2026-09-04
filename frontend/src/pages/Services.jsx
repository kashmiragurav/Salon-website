import { getActiveServices } from "../services/serviceService";
import { usePublicCollection } from "../hooks/useSalonData";
import ServiceCard from "../components/ServiceCard";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
const loadServices = () => getActiveServices();
function Services() { const state = usePublicCollection(loadServices); return <section className="section page-intro"><span className="eyebrow">The menu</span><h1>Services shaped around you.</h1>{state.loading ? <LoadingState label="Loading services" /> : state.error ? <ErrorState /> : state.data.length ? <div className="service-grid">{state.data.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <EmptyState message="Services will appear here soon." />}</section>; }

export default Services;