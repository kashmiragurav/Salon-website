import { Quote } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "./DataState";

export default function TestimonialList({ testimonials, loading, error }) { if (loading) return <LoadingState label="Loading testimonials" />; if (error) return <ErrorState />; if (!testimonials.length) return <EmptyState message="Testimonials will appear here soon." />; return <div className="testimonial-grid">{testimonials.map((testimonial) => <article className="testimonial" key={testimonial.id}><Quote size={22} /><p>“{testimonial.reviewText}”</p><strong>{testimonial.clientName}</strong><span>{testimonial.rating ? `${testimonial.rating}/5` : "Client review"}</span></article>)}</div>; }
