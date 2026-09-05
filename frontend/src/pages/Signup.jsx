import { useEffect, useState } from "react";
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
  useEffect(() => { if (user) navigate(location.state?.from || "/my-appointments", { replace: true }); }, [user, navigate, location.state]);
  if (user) return null;
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || form.password.length < 6 || form.password !== form.confirmPassword || !validatePhone(form.phone)) { setState({ loading: false, error: "Enter valid details and matching passwords.", alreadyExists: false }); return; } setState({ loading: true, error: "", alreadyExists: false }); try { await signup(form); navigate(location.state?.from || "/my-appointments", { replace: true }); } catch (error) { console.error(error); setState({ loading: false, error: messages[error.code] || `We could not create your account (${error.code || "Firebase error"}). Please try again.`, alreadyExists: error.code === "auth/email-already-in-use" }); } };
  return <section className="section page-intro auth-page"><span className="eyebrow">Client account</span><h1>Create your account.</h1><form className="form-panel" onSubmit={submit} noValidate><label>Full name<input required name="name" value={form.name} onChange={update} autoComplete="name" /></label><label>Email<input required type="email" name="email" value={form.email} onChange={update} autoComplete="email" /></label><label>Phone<input required type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" /></label><label>Password<input required minLength="6" type="password" name="password" value={form.password} onChange={update} autoComplete="new-password" /></label><label>Confirm password<input required minLength="6" type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} autoComplete="new-password" /></label>{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.alreadyExists && <Link className="text-link" to={{ pathname: "/login", state: { from: location.state?.from } }}>Login instead</Link>}<button className="button" disabled={state.loading}>{state.loading ? "Creating account..." : "Create account"}</button><Link className="text-link" to={{ pathname: "/login", state: { from: location.state?.from } }}>Already have an account? Login</Link></form></section>;
}
