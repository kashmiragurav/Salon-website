import { useState } from "react";
import { createBooking, validateBooking } from "../services/bookingService";
import { usePublicCollection } from "../hooks/useSalonData";
import { ErrorState, LoadingState } from "../components/DataState";
import { getActiveServices } from "../services/serviceService";
import { useClientAuth } from "../hooks/useClientAuth";

const loadServices = () => getActiveServices();

function BookAppointment() {
  const services = usePublicCollection(loadServices);
  const { user } = useClientAuth();
  const [form, setForm] = useState({ customerName: "", phone: "", serviceSelected: "", serviceId: "", preferredDate: "", preferredTime: "", notes: "" });
  const [state, setState] = useState({ loading: false, error: "", sent: false, validation: {} });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    const validation = validateBooking(form);
    if (Object.keys(validation).length) {
      setState({ loading: false, error: "Please check the highlighted fields.", sent: false, validation });
      return;
    }
    setState({ loading: true, error: "", sent: false, validation: {} });
    try {
      await createBooking(form);
      setForm({ customerName: "", phone: "", serviceSelected: "", serviceId: "", preferredDate: "", preferredTime: "", notes: "" });
      setState({ loading: false, error: "", sent: true, validation: {} });
    } catch (error) {
      console.error(error);
      setState({ loading: false, error: `We could not send your booking request (${error.code || "Firestore error"}). Please try again.`, sent: false, validation: {} });
    }
  };
  const field = (name, label, type = "text") => <label key={name}>{label}<input required aria-invalid={Boolean(state.validation[name])} aria-describedby={state.validation[name] ? `${name}-error` : undefined} type={type} name={name} value={form[name]} onChange={update} min={type === "date" ? new Date().toISOString().slice(0, 10) : undefined} />{state.validation[name] && <span id={`${name}-error`} className="error-message">{state.validation[name]}</span>}</label>;
  const selectService = (event) => { const selected = services.data.find((service) => service.id === event.target.value); setForm({ ...form, serviceId: event.target.value, serviceSelected: selected?.name || "" }); };
  return <section className="section page-intro booking-page"><span className="eyebrow">Appointments</span><h1>Make time for yourself.</h1>{!user && <p className="lead">Please log in or create a client account before requesting an appointment.</p>}{services.loading && <LoadingState label="Loading available services" />}{services.error && <ErrorState message="We could not load available services. Please try again later." />}{user && !services.loading && !services.error && <form className="form-panel" onSubmit={submit} noValidate><p>Choose a service and preferred time. We will contact you to confirm availability.</p>{field("customerName", "Name")}{field("phone", "Phone", "tel")}<label>Service<select required aria-invalid={Boolean(state.validation.serviceSelected)} name="serviceId" value={form.serviceId} onChange={selectService}><option value="">Select a service</option>{services.data.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select>{state.validation.serviceSelected && <span className="error-message">{state.validation.serviceSelected}</span>}</label>{field("preferredDate", "Preferred date", "date")}{field("preferredTime", "Preferred time", "time")}<label>Notes<textarea name="notes" rows="4" value={form.notes} onChange={update} />{state.validation.notes && <span className="error-message">{state.validation.notes}</span>}</label>{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.sent && <p className="success-message" role="status">Your appointment request has been submitted successfully.</p>}<button className="button" disabled={state.loading}>{state.loading ? "Sending..." : "Request appointment"}</button></form>}</section>;
}

export default BookAppointment;
