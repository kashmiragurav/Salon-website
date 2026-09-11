import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, authPersistenceReady } from "../firebase/config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ loading: false, error: "", sent: false });
  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState({ loading: false, error: "Please enter a valid email address.", sent: false }); return; }
    setState({ loading: true, error: "", sent: false });
    try { await authPersistenceReady; await sendPasswordResetEmail(auth, email.trim()); setState({ loading: false, error: "", sent: true }); } catch (error) { console.error(error); setState({ loading: false, error: "We could not send a reset link. Please check the email and try again.", sent: false }); }
  };
  return <section className="section page-intro auth-page"><span className="eyebrow">Account access</span><h1>Reset your password.</h1><form className="form-panel" onSubmit={submit} noValidate><label>Email *<input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setState((current) => ({ ...current, error: "" })); }} autoComplete="email" /></label>{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.sent && <p className="success-message" role="status">If an account exists for that email, a reset link has been sent.</p>}<button className="button" disabled={state.loading}>{state.loading ? "Sending..." : "Send reset link"}</button><Link className="text-link" to="/login">Return to login</Link></form></section>;
}