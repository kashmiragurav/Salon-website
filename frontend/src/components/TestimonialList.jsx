import { Quote, Star } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "./DataState";

export default function TestimonialList({ testimonials, loading, error }) {
  if (loading) return <LoadingState label="Loading testimonials" />;
  if (error) return <ErrorState />;
  if (!testimonials.length) return <EmptyState message="Testimonials will appear here soon." />;

  return (
    <div className="testimonial-grid">
      {testimonials.map((testimonial) => {
        const numericRating = Number(testimonial.rating) || 0;
        const initials = String(testimonial.clientName || "Client")
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() || "")
          .join("") || "C";

        return (
          <article className="testimonial" key={testimonial.id}>
            <div className="testimonial-head">
              <div className="testimonial-avatar" aria-label={testimonial.clientName || "Client avatar"}>
                {testimonial.photoUrl ? <img src={testimonial.photoUrl} alt={testimonial.clientName || "Client"} /> : initials}
              </div>
              <div className="testimonial-meta">
                <strong>{testimonial.clientName || "Client"}</strong>
                <div className="testimonial-stars" aria-label={`${numericRating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={`${testimonial.id}-star-${index}`} size={14} className={index < numericRating ? "is-filled" : ""} fill={index < numericRating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
            </div>
            <Quote size={22} className="testimonial-quote" />
            <p>“{testimonial.reviewText}”</p>
          </article>
        );
      })}
    </div>
  );
}
