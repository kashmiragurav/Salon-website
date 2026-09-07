import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useClientAuth } from "../hooks/useClientAuth";

const messages = { "auth/invalid-credential": "Email or password is incorrect.", "auth/email-already-in-use": "An account already exists with this email.", "auth/weak-password": "Use a password with at least 6 characters." };
const validate = (form) => {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  return errors;
};

export default function Login() {
  const { user, login } = useClientAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "", validation: {} });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { if (user) navigate(location.state?.from || "/my-appointments", { replace: true }); }, [user, navigate, location.state]);
  if (user) return null;
  const update = (event) => {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    setForm(nextForm);
    setState((current) => ({ ...current, validation: { ...current.validation, [event.target.name]: validate(nextForm)[event.target.name] } }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length) { setState({ loading: false, error: "", validation }); return; }
    setState({ loading: true, error: "", validation: {} });
    try { await login(form.email, form.password); navigate(location.state?.from || "/my-appointments", { replace: true }); }
    catch (error) { console.error(error); setState({ loading: false, error: messages[error.code] || "We could not access your account. Please try again.", validation: {} }); }
  };
  return <section className="section page-intro auth-page"><span className="eyebrow">Client account</span><h1>Welcome back.</h1><form className="form-panel" onSubmit={submit} noValidate><label>Email *<input type="email" name="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={Boolean(state.validation.email)} />{state.validation.email && <span className="error-message">{state.validation.email}</span>}</label><label>Password *<span className="password-input"><input name="password" value={form.password} onChange={update} autoComplete="current-password" type={showPassword ? "text" : "password"} aria-invalid={Boolean(state.validation.password)} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{state.validation.password && <span className="error-message">{state.validation.password}</span>}</label>{state.error && <p className="error-message" role="alert">{state.error}</p>}<Link className="text-link" to="/forgot-password">Forgot password?</Link><button className="button" disabled={state.loading}>{state.loading ? "Logging in..." : "Log in"}</button><Link className="text-link" to={{ pathname: "/signup", state: { from: location.state?.from } }}>Don't have an account? Sign Up</Link></form><Link className="text-link" to="/">Return to the salon</Link></section>;
}
