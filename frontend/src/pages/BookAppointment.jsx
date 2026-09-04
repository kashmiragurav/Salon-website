import { useState } from "react";
import { createBooking } from "../services/bookingService";
import { usePublicCollection } from "../hooks/useSalonData";
import { getActiveServices } from "../services/serviceService";

const loadServices = () => getActiveServices();

function BookAppointment() {
  const services = usePublicCollection(loadServices);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", preferredDate: "", preferredTime: "", notes: "" });
  const [state, setState] = useState({ loading: false, error: "", sent: false });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: "", sent: false });
    try {
      await createBooking(form);
      setForm({ name: "", email: "", phone: "", service: "", preferredDate: "", preferredTime: "", notes: "" });
      setState({ loading: false, error: "", sent: true });
    } catch (error) {
      console.error(error);
      setState({ loading: false, error: "We could not send your booking request. Please try again.", sent: false });
    }
  };
  return <section className="section page-intro booking-page"><span className="eyebrow">Appointments</span><h1>Make time for yourself.</h1><form className="form-panel" onSubmit={submit}>{[["name", "Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"], ["preferredDate", "Preferred date", "date"], ["preferredTime", "Preferred time", "time"]].map(([name, label, type]) => <label key={name}>{label}<input required={name !== "phone"} type={type} name={name} value={form[name]} onChange={update} /></label>)}<label>Service<select required name="service" value={form.service} onChange={update}><option value="">Select a service</option>{services.data.map((service) => <option key={service.id} value={service.name}>{service.name}</option>)}</select></label><label>Notes<textarea name="notes" rows="4" value={form.notes} onChange={update} /></label>{state.error && <p className="error-message">{state.error}</p>}{state.sent && <p className="success-message">Thank you. We will be in touch to confirm your appointment.</p>}<button className="button" disabled={state.loading || services.loading}>{state.loading ? "Sending..." : "Request appointment"}</button></form></section>;
}

export default BookAppointment;
