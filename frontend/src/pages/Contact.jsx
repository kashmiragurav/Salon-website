import { useState } from "react";
import { createEnquiry, validateEnquiry } from "../services/enquiryService";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

function Contact({ settings }) {
  const salon = settings.data;
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: false, error: "", sent: false, validation: {} });
  const update = (event) => { const nextForm = { ...form, [event.target.name]: event.target.value }; setForm(nextForm); setState((current) => ({ ...current, validation: { ...current.validation, [event.target.name]: validateEnquiry(nextForm)[event.target.name] } })); };
  const submit = async (event) => {
    event.preventDefault();
    const validation = validateEnquiry(form);
    if (Object.keys(validation).length) {
      setState({ loading: false, error: "Please check the highlighted fields.", sent: false, validation });
      return;
    }
    setState({ loading: true, error: "", sent: false, validation: {} });
    try {
      await createEnquiry(form);
      setForm(initialForm);
      setState({ loading: false, error: "", sent: true, validation: {} });
    } catch (error) {
      console.error(error);
      setState({ loading: false, error: "We could not send your message. Please try again.", sent: false, validation: {} });
    }
  };
  const field = (name, label, type = "text") => <label key={name}>{label}<input aria-invalid={Boolean(state.validation[name])} aria-describedby={state.validation[name] ? `${name}-error` : undefined} type={type} name={name} value={form[name]} onChange={update} />{state.validation[name] && <span id={`${name}-error`} className="error-message">{state.validation[name]}</span>}</label>;
  return <section className="section contact-layout"><div className="page-intro"><span className="eyebrow">Contact</span><h1>Come and say hello.</h1><div className="contact-details"><p>{salon?.address || "Address unavailable"}</p><a href={salon?.phone ? `tel:${salon.phone}` : undefined}>{salon?.phone || "Phone unavailable"}</a><a href={salon?.whatsappNumber ? `https://wa.me/${salon.whatsappNumber.replace(/\D/g, "")}` : undefined}>WhatsApp</a></div>{salon?.mapEmbedUrl && <iframe title="Salon location" src={salon.mapEmbedUrl} loading="lazy" />}</div><form className="form-panel" onSubmit={submit} noValidate><h2>Send an enquiry</h2>{field("name", "Name")}{field("email", "Email", "email")}{field("phone", "Phone", "tel")}{field("subject", "Subject")}<label>Message<textarea aria-invalid={Boolean(state.validation.message)} name="message" rows="5" value={form.message} onChange={update} />{state.validation.message && <span className="error-message">{state.validation.message}</span>}</label>{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.sent && <p className="success-message" role="status">Thank you. Your enquiry has been sent.</p>}<button className="button" disabled={state.loading}>{state.loading ? "Sending..." : "Send message"}</button></form></section>;
}

export default Contact;
