import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";

const messages = { "auth/invalid-credential": "Email or password is incorrect.", "auth/email-already-in-use": "An account already exists with this email.", "auth/weak-password": "Use a password with at least 6 characters." };

export default function Login() {
  const { user, login, register } = useClientAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "" });
  useEffect(() => { if (user) navigate(location.state?.from || "/my-appointments", { replace: true }); }, [user, navigate, location.state]);
  if (user) return null;
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setState({ loading: true, error: "" }); try { await (mode === "login" ? login(form.email, form.password) : register(form.email, form.password)); navigate(location.state?.from || "/my-appointments", { replace: true }); } catch (error) { console.error(error); setState({ loading: false, error: messages[error.code] || "We could not access your account. Please try again." }); } };
  return <section className="section page-intro auth-page"><span className="eyebrow">Client account</span><h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1><form className="form-panel" onSubmit={submit}><label>Email<input required type="email" name="email" value={form.email} onChange={update} autoComplete="email" /></label><label>Password<input required minLength="6" type="password" name="password" value={form.password} onChange={update} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>{state.error && <p className="error-message" role="alert">{state.error}</p>}<button className="button" disabled={state.loading}>{state.loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button><button type="button" className="text-link auth-switch" onClick={() => { setMode(mode === "login" ? "register" : "login"); setState({ loading: false, error: "" }); }}>{mode === "login" ? "Create a client account" : "I already have an account"}</button></form><Link className="text-link" to="/">Return to the salon</Link></section>;
}
