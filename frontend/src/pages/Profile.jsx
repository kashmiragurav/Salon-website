import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";
import { getClientProfile, updateClientProfile } from "../services/userService";
import { validatePhone } from "../services/bookingService";
import { LoadingState } from "../components/DataState";

export default function Profile() {
  const { user } = useClientAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [state, setState] = useState({ loading: true, saving: false, error: "", success: "" });
  useEffect(() => { getClientProfile(user.uid).then((profile) => setForm({ name: profile?.name || "", phone: profile?.phone || "" })).catch((error) => { console.error(error); setState({ loading: false, saving: false, error: "Unable to load your profile.", success: "" }); return; }).finally(() => setState((current) => ({ ...current, loading: false }))); }, [user.uid]);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); if (!form.name.trim() || !validatePhone(form.phone)) { setState((current) => ({ ...current, error: "Enter your name and a valid phone number.", success: "" })); return; } setState((current) => ({ ...current, saving: true, error: "", success: "" })); try { await updateClientProfile(user.uid, form); setState((current) => ({ ...current, saving: false, success: "Profile updated successfully." })); } catch (error) { console.error(error); setState((current) => ({ ...current, saving: false, error: "Unable to update your profile.", success: "" })); } };
  if (state.loading) return <LoadingState label="Loading your profile" />;
  return <section className="section page-intro auth-page"><span className="eyebrow">My account</span><h1>Your profile.</h1><form className="form-panel" onSubmit={submit}><label>Email<input value={user.email || ""} readOnly /></label><label>Full name<input required name="name" value={form.name} onChange={update} autoComplete="name" /></label><label>Phone<input required name="phone" value={form.phone} onChange={update} autoComplete="tel" /></label>{state.error && <p className="error-message" role="alert">{state.error}</p>}{state.success && <p className="success-message" role="status">{state.success}</p>}<button className="button" disabled={state.saving}>{state.saving ? "Saving..." : "Save profile"}</button></form><Link className="text-link" to="/my-appointments">My appointments</Link></section>;
}
