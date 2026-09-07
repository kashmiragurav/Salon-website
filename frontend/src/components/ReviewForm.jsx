import { useState } from "react";
import { Link } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";
import { createClientTestimonial } from "../services/testimonialService";

const initialForm = { clientName: "", rating: "", reviewText: "", photoUrl: "" };

function validate(form) {
  const errors = {};
  if (!form.clientName.trim()) errors.clientName = "Client name is required.";
  if (!Number.isInteger(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 5) errors.rating = "Choose a rating from 1 to 5.";
  if (!form.reviewText.trim()) errors.reviewText = "Review text is required.";
  if (form.photoUrl.trim()) {
    try { new URL(form.photoUrl); } catch { errors.photoUrl = "Enter a valid image URL."; }
  }
  return errors;
}

export default function ReviewForm() {
  const { user } = useClientAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, error: "", sent: false });

  if (!user) return <p className="review-signin">Have you visited us? <Link className="text-link" to="/login">Log in to leave a review.</Link></p>;

  const update = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors((current) => ({ ...current, [name]: validate(nextForm)[name] }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setState({ loading: true, error: "", sent: false });
    try {
      await createClientTestimonial({ ...form, userId: user.uid });
      setForm(initialForm);
      setErrors({});
      setState({ loading: false, error: "", sent: true });
    } catch (error) {
      console.error("Review submission failed:", error);
      setState({ loading: false, error: "We could not submit your review. Please try again.", sent: false });
    }
  };

  return <form className="form-panel review-form" onSubmit={submit} noValidate>
    <h3>Share your experience</h3>
    <label>Client name *<input name="clientName" value={form.clientName} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.clientName)} />{errors.clientName && <span className="error-message">{errors.clientName}</span>}</label>
    <label>Rating *<select name="rating" value={form.rating} onChange={update} aria-invalid={Boolean(errors.rating)}><option value="">Select rating</option>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>)}</select>{errors.rating && <span className="error-message">{errors.rating}</span>}</label>
    <label>Review *<textarea name="reviewText" rows="4" value={form.reviewText} onChange={update} aria-invalid={Boolean(errors.reviewText)} />{errors.reviewText && <span className="error-message">{errors.reviewText}</span>}</label>
    <label>Photo URL (optional)<input name="photoUrl" type="url" value={form.photoUrl} onChange={update} placeholder="https://..." aria-invalid={Boolean(errors.photoUrl)} />{errors.photoUrl && <span className="error-message">{errors.photoUrl}</span>}</label>
    {state.error && <p className="error-message" role="alert">{state.error}</p>}
    {state.sent && <p className="success-message" role="status">Thank you. Your review is awaiting approval.</p>}
    <button className="button" disabled={state.loading}>{state.loading ? "Submitting..." : "Submit review"}</button>
  </form>;
}