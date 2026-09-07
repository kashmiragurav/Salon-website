import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";
import { validatePhone } from "../services/bookingService";

const messages = { "auth/email-already-in-use": "An account with this email already exists. Please login instead.", "auth/weak-password": "Use a password with at least 6 characters." };

export default function Signup() {
  const { user, signup } = useClientAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [state, setState] = useState({ loading: false, error: "", alreadyExists: false });
  const [validation, setValidation] = useState({});
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });
  useEffect(() => { if (user) navigate(location.state?.from || "/my-appointments", { replace: true }); }, [user, navigate, location.state]);
  if (user) return null;
  const validate = (nextForm) => {
    const errors = {};
    if (nextForm.name.trim().length < 2) errors.name = "Enter at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextForm.email)) errors.email = "Please enter a valid email address.";
    if (!validatePhone(nextForm.phone)) errors.phone = "Enter a valid phone number.";
    if (nextForm.password.length < 8) errors.password = "Use at least 8 characters.";
    if (nextForm.confirmPassword !== nextForm.password) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };
  const update = (event) => { const nextForm = { ...form, [event.target.name]: event.target.value }; setForm(nextForm); setValidation((current) => ({ ...current, [event.target.name]: validate(nextForm)[event.target.name] })); };
  const submit = async (event) => { event.preventDefault(); const errors = validate(form); if (Object.keys(errors).length) { setValidation(errors); return; } setState({ loading: true, error: "", alreadyExists: false }); try { await signup(form); navigate(location.state?.from || "/my-appointments", { replace: true }); } catch (error) { console.error(error); setState({ loading: false, error: messages[error.code] || "We could not create your account. Please try again.", alreadyExists: error.code === "auth/email-already-in-use" }); } };
  const passwordField = (name, label) => <label>{label} *<span className="password-input"><input name={name} value={form[name]} onChange={update} autoComplete="new-password" type={visible[name] ? "text" : "password"} aria-invalid={Boolean(validation[name])} /><button type="button" onClick={() => setVisible((current) => ({ ...current, [name]: !current[name] }))} aria-label={visible[name] ? "Hide password" : "Show password"}>{visible[name] ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{validation[name] && <span className="error-message">{validation[name]}</span>}</label>;
  return <section className="section page-intro auth-page"><span className="eyebrow">Client account</span><h1>Create your account.</h1><form className="form-panel" onSubmit={submit} noValidate><label>Full name *<input name="name" value={form.name} onChange={update} autoComplete="name" aria-invalid={Boolean(validation.name)} />{validation.name && <span className="error-message">{validation.name}</span>}</label><label>Email *<input type="email" name="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={Boolean(validation.email)} />{validation.email && <span className="error-message">{validation.email}</span>}</label><label>Phone *<input type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" aria-invalid={Boolean(validation.phone)} />{validation.phone && <span className="error-message">{validation.phone}</span>}</label>{passwordField("password", "Password")}{passwordField("confirmPassword", "Confirm password")}{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.alreadyExists && <Link className="text-link" to={{ pathname: "/login", state: { from: location.state?.from } }}>Login instead</Link>}<button className="button" disabled={state.loading}>{state.loading ? "Signing up..." : "Create account"}</button><Link className="text-link" to={{ pathname: "/login", state: { from: location.state?.from } }}>Already have an account? Login</Link></form></section>;
}
