import { getApprovedTestimonials } from "../services/testimonialService";
import { usePublicCollection } from "../hooks/useSalonData";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";
import TestimonialList from "../components/TestimonialList";
import ReviewForm from "../components/ReviewForm";

const loadTestimonials = () => getApprovedTestimonials();

export default function Testimonials() {
  const state = usePublicCollection(loadTestimonials);
  return <section className="section page-intro testimonials-page-public"><span className="eyebrow">Kind words</span><h1>From our clients.</h1>{state.loading ? <LoadingState label="Loading testimonials" /> : state.error ? <ErrorState message="We could not load testimonials. Please try again later." /> : state.data.length ? <TestimonialList {...state} testimonials={state.data} /> : <EmptyState message="Testimonials will appear here soon." />}<ReviewForm /></section>;
}
