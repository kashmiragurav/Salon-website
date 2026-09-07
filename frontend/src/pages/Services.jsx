import { useSearchParams } from "react-router-dom";
import { getActiveServices } from "../services/serviceService";
import { usePublicCollection } from "../hooks/useSalonData";
import ServiceCard from "../components/ServiceCard";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
const loadServices = () => getActiveServices();
function Services() {
	const state = usePublicCollection(loadServices);
	const [searchParams, setSearchParams] = useSearchParams();
	const category = searchParams.get("category") || "All";
	const categories = ["All", ...new Set(state.data.map((service) => service.category).filter(Boolean))];
	const visible = state.data.filter((service) => category === "All" || service.category === category);

	const updateCategory = (nextCategory) => {
		const nextParams = {};
		if (nextCategory !== "All") nextParams.category = nextCategory;
		setSearchParams(nextParams);
	};

	return <section className="section page-intro"><span className="eyebrow">The menu</span><h1>Services shaped around you.</h1>{state.loading ? <LoadingState label="Loading services" /> : state.error ? <ErrorState /> : state.data.length ? <><div className="appointment-tabs" role="tablist" aria-label="Service categories">{categories.map((item) => <button type="button" role="tab" aria-selected={category === item} className={category === item ? "is-active" : ""} onClick={() => updateCategory(item)} key={item}>{item}</button>)}</div>{visible.length ? <div className="service-grid">{visible.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <EmptyState message="No services in this category." />}</> : <EmptyState message="Services will appear here soon." />}</section>;
}

export default Services;