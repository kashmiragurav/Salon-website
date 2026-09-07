import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";
import { createClientTestimonial } from "../services/testimonialService";

const initialForm = { clientName: "", email: "", rating: "", reviewText: "", photoUrl: "" };

function validate(form) {
  const errors = {};
  if (!form.clientName.trim()) errors.clientName = "Name is required.";
  else if (form.clientName.trim().length < 2) errors.clientName = "Enter at least 2 characters.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!Number.isInteger(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 5) errors.rating = "Choose a rating from 1 to 5.";
  if (!form.reviewText.trim()) errors.reviewText = "Review is required.";
  else if (form.reviewText.trim().length < 10) errors.reviewText = "Write at least 10 characters.";
  if (form.photoUrl.trim()) {
    try { new URL(form.photoUrl); } catch { errors.photoUrl = "Enter a valid image URL."; }
  }
  return errors;
}

  function reviewErrorMessage(error) {
    if (error?.code === "permission-denied") return "Reviews are temporarily unavailable. Please try again later.";
    if (error?.code === "unauthenticated") return "Please sign in to submit a review.";
    if (error?.code === "invalid-argument") return "Please check the review details and try again.";
    if (error?.code === "failed-precondition") return "Reviews are temporarily unavailable. Please try again later.";
    return "Unable to submit your review right now. Please try again.";
  }

export default function ReviewForm() {
  const { user } = useClientAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, error: "", sent: false });

  const update = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors((current) => ({ ...current, [name]: validate(nextForm)[name] || "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!user) {
      setState({ loading: false, error: "Please log in to submit a review.", sent: false });
      return;
    }
    setState({ loading: true, error: "", sent: false });
    try {
      await createClientTestimonial({ ...form, userId: user?.uid, email: form.email || user?.email || "" });
      setForm(initialForm);
      setErrors({});
      setState({ loading: false, error: "", sent: true });
    } catch (error) {
        console.error("Review submission failed:", { code: error?.code, message: error?.message, name: error?.name, error });
        setState({ loading: false, error: reviewErrorMessage(error), sent: false });
    }
  };

  return <form className="form-panel review-form" onSubmit={submit} noValidate>
    <h3>Share your experience</h3>
    {!user && <p className="review-note">Please <Link className="text-link" to="/login">log in</Link> before submitting a review. Reviews are checked before they appear publicly.</p>}
    <label>Client name *<input name="clientName" value={form.clientName} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.clientName)} />{errors.clientName && <span className="error-message">{errors.clientName}</span>}</label>
    <label>Email (optional)<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <span className="error-message">{errors.email}</span>}</label>
    <fieldset className="rating-selector"><legend>Rating *</legend><div>{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} className={Number(form.rating) >= rating ? "is-selected" : ""} onClick={() => update({ target: { name: "rating", value: String(rating) } })} aria-label={`${rating} star${rating === 1 ? "" : "s"}`}><Star size={23} fill="currentColor" /></button>)}</div>{errors.rating && <span className="error-message">{errors.rating}</span>}</fieldset>
    <label>Review *<textarea name="reviewText" rows="4" value={form.reviewText} onChange={update} aria-invalid={Boolean(errors.reviewText)} />{errors.reviewText && <span className="error-message">{errors.reviewText}</span>}</label>
    <label>Photo URL (optional)<input name="photoUrl" type="url" value={form.photoUrl} onChange={update} placeholder="https://..." aria-invalid={Boolean(errors.photoUrl)} />{errors.photoUrl && <span className="error-message">{errors.photoUrl}</span>}</label>
    {state.error && <p className="error-message" role="alert">{state.error}</p>}
    {state.sent && <p className="success-message" role="status">Thank you. Your review is awaiting approval.</p>}
    <button className="button" disabled={state.loading}>{state.loading ? "Submitting..." : "Submit review"}</button>
  </form>;
}