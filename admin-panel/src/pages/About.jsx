import { useEffect, useState } from "react";
import { Image, Save, Sparkles } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";
import { getSalonSettings, saveSalonSettings } from "../services/settingsService";

const emptyAbout = {
  aboutTitle: "",
  aboutShortDescription: "",
  aboutDescription: "",
  aboutImageUrl: "",
  yearsActive: "",
  mission: "",
  vision: "",
};

const validateAbout = (about) => {
  const errors = {};
  if (!about.aboutTitle.trim()) errors.aboutTitle = "About title is required.";
  if (!about.aboutShortDescription.trim()) errors.aboutShortDescription = "Short description is required.";
  if (!about.aboutDescription.trim()) errors.aboutDescription = "Detailed description is required.";
  if (about.aboutImageUrl.trim()) {
    try { new URL(about.aboutImageUrl); } catch { errors.aboutImageUrl = "Enter a valid image URL."; }
  }
  if (about.yearsActive !== "" && (!Number.isInteger(Number(about.yearsActive)) || Number(about.yearsActive) < 0)) errors.yearsActive = "Enter a whole number of 0 or more.";
  return errors;
};

function About() {
  const [about, setAbout] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    getSalonSettings().then((data) => {
      if (active && data) setAbout({ ...emptyAbout, ...data, yearsActive: data.yearsActive ?? "" });
    }).catch(() => {
      if (active) setError("We could not load About information. Please try again.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const next = { ...about, [event.target.name]: event.target.value };
    setAbout(next);
    setErrors((current) => ({ ...current, [event.target.name]: validateAbout(next)[event.target.name] }));
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateAbout(about);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setSaving(true); setError(""); setSuccess(false);
    try { await saveSalonSettings(about); setSuccess(true); }
    catch { setError("We could not save About information. Please try again."); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner label="Loading About information" />;
  const field = (name, label) => <label className="settings-field"><span>{label} *</span><input name={name} value={about[name]} onChange={handleChange} />{errors[name] && <small>{errors[name]}</small>}</label>;
  const optional = (name, label, type = "text") => <label className="settings-field"><span>{label}</span><input name={name} type={type} value={about[name]} onChange={handleChange} />{errors[name] && <small>{errors[name]}</small>}</label>;
  const textarea = (name, label, required = false) => <label className="settings-field"><span>{label}{required ? " *" : ""}</span><textarea name={name} value={about[name]} onChange={handleChange} rows="4" />{errors[name] && <small>{errors[name]}</small>}</label>;

  return <div className="settings-page">
    <header className="module-heading"><div><p className="eyebrow">Content management</p><h1>About</h1><p>Tell visitors what makes your salon worth returning to.</p></div><button type="submit" form="about-form" className="button-primary" disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save About"}</button></header>
    {error && <div className="module-error" role="alert">{error}</div>}
    {success && <div className="settings-success" role="status">About information updated successfully.</div>}
    <form id="about-form" className="settings-form" onSubmit={handleSubmit} noValidate>
      <section className="settings-section"><div className="settings-section__heading"><span className="settings-section__icon"><Sparkles size={18} /></span><div><h2>About content</h2><p>Use concise, welcoming copy that reflects the salon experience.</p></div></div><div className="settings-section__body">{field("aboutTitle", "About title")}{field("aboutShortDescription", "Short description")}{textarea("aboutDescription", "Detailed description", true)}{textarea("mission", "Mission")}{textarea("vision", "Vision")}</div></section>
      <section className="settings-section"><div className="settings-section__heading"><span className="settings-section__icon"><Image size={18} /></span><div><h2>About image and highlights</h2><p>These details appear on the public About page.</p></div></div><div className="settings-section__body"><div className="settings-grid">{optional("aboutImageUrl", "Image URL", "url")}{optional("yearsActive", "Years of experience", "number")}</div>{about.aboutImageUrl && <img className="about-image-preview" src={about.aboutImageUrl} alt="About our salon preview" onError={(event) => { event.currentTarget.style.display = "none"; }} />}</div></section>
    </form>
  </div>;
}

export default About;