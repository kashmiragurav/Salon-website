import { useEffect, useState } from "react";
import { BarChart3, Check, Clock3, Globe2, Image, MapPinned, Phone, Save, Sparkles } from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";
import { getSalonSettings, saveSalonSettings } from "../services/settingsService";

const emptySettings = {
  salonName: "", address: "", phone: "", whatsappNumber: "", workingHours: "",
  instagramLink: "", facebookLink: "", mapEmbedUrl: "", logoUrl: "", heroImageUrl: "",
  heroTitle: "", heroDescription: "", yearsActive: "", clientsServed: "", staffCount: "",
  aboutTitle: "", aboutShortDescription: "", aboutDescription: "", aboutImageUrl: "", mission: "", vision: "",
};

const urlFields = ["instagramLink", "facebookLink", "mapEmbedUrl", "logoUrl", "heroImageUrl"];

const validateSettings = (settings) => {
  const errors = {};
  if (!settings.salonName.trim()) errors.salonName = "Salon name is required.";
  if (!settings.address.trim()) errors.address = "Address is required.";
  if (!settings.phone.trim()) errors.phone = "Phone is required.";
  if (!settings.workingHours.trim()) errors.workingHours = "Working hours are required.";
  if (!settings.heroTitle.trim()) errors.heroTitle = "Hero title is required.";
  ["yearsActive", "clientsServed", "staffCount"].forEach((field) => {
    if (settings[field] !== "" && (!Number.isInteger(Number(settings[field])) || Number(settings[field]) < 0)) errors[field] = "Enter a whole number of 0 or more.";
  });
  urlFields.forEach((field) => {
    if (!settings[field].trim()) return;
    try { new URL(settings[field]); } catch { errors[field] = "Enter a valid URL."; }
  });
  return errors;
};

function Settings() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    getSalonSettings().then((data) => {
      if (active && data) setSettings({ ...emptySettings, ...data, yearsActive: data.yearsActive ?? "", clientsServed: data.clientsServed ?? "", staffCount: data.staffCount ?? "", aboutTitle: data.aboutTitle ?? "", aboutShortDescription: data.aboutShortDescription ?? "", aboutDescription: data.aboutDescription ?? "", aboutImageUrl: data.aboutImageUrl ?? "", mission: data.mission ?? "", vision: data.vision ?? "" });
    }).catch((settingsError) => {
      console.error("Salon settings failed to load:", settingsError);
      if (active) setError("We could not load salon settings from Firestore.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const nextSettings = { ...settings, [event.target.name]: event.target.value };
    setSettings(nextSettings);
    setErrors((current) => ({ ...current, [event.target.name]: validateSettings(nextSettings)[event.target.name] }));
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateSettings(settings);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSaving(true); setError(""); setSuccess(false);
    try { await saveSalonSettings(settings); setSuccess(true); }
    catch (settingsError) { console.error("Salon settings failed to save:", settingsError); setError("We could not save salon settings. Please try again."); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner label="Loading salon settings" />;

  const field = (name, label, type = "text", placeholder = "") => <label className="settings-field"><span>{label}</span><input name={name} type={type} value={settings[name]} onChange={handleChange} placeholder={placeholder} min={type === "number" ? "0" : undefined} step={type === "number" ? "1" : undefined} />{errors[name] && <small>{errors[name]}</small>}</label>;
  const textarea = (name, label, placeholder = "", rows = "3") => <label className="settings-field"><span>{label}</span><textarea name={name} value={settings[name]} onChange={handleChange} placeholder={placeholder} rows={rows} />{errors[name] && <small>{errors[name]}</small>}</label>;

  return (
    <div className="settings-page">
      <header className="module-heading"><div><p className="eyebrow">Content management</p><h1>Salon settings</h1><p>Keep the salon identity and public-facing details in one place.</p></div><button type="submit" form="salon-settings-form" className="button-primary" disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save changes"}</button></header>
      {error && <div className="module-error" role="alert">{error}</div>}
      {success && <div className="settings-success" role="status"><Check size={16} /> Settings saved successfully.</div>}
      <form id="salon-settings-form" className="settings-form" onSubmit={handleSubmit} noValidate>
        <SettingsSection icon={Sparkles} title="Salon Information" description="The name and location visitors associate with your salon.">{field("salonName", "Salon name", "text", "Your salon name")}{textarea("address", "Address", "Street, city, postcode")}</SettingsSection>
        <SettingsSection icon={Phone} title="Contact Information" description="The quickest ways for clients to reach the salon."><div className="settings-grid">{field("phone", "Phone", "tel", "+1 555 000 0000")}{field("whatsappNumber", "WhatsApp number", "tel", "+1 555 000 0000")}</div></SettingsSection>
        <SettingsSection icon={Globe2} title="Social Media" description="Connect clients with the salon's social channels."><div className="settings-grid">{field("instagramLink", "Instagram URL", "url", "https://instagram.com/...")}{field("facebookLink", "Facebook URL", "url", "https://facebook.com/...")}</div></SettingsSection>
        <SettingsSection icon={Clock3} title="Working Hours" description="Use one line per day or a compact schedule.">{textarea("workingHours", "Hours", "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM", "5")}</SettingsSection>
        <SettingsSection icon={Image} title="Hero Section" description="The main message and imagery for the public homepage.">{field("heroTitle", "Hero title", "text", "Your salon headline")}{textarea("heroDescription", "Hero description", "A short introduction to your salon.")}{field("heroImageUrl", "Hero image URL", "url", "https://...")}{field("logoUrl", "Logo URL", "url", "https://...")}</SettingsSection>
        <SettingsSection icon={BarChart3} title="Statistics" description="Optional numbers used for salon highlights."><div className="settings-grid settings-grid--three">{field("yearsActive", "Years active", "number", "0")}{field("clientsServed", "Clients served", "number", "0")}{field("staffCount", "Staff count", "number", "0")}</div></SettingsSection>
        <SettingsSection icon={MapPinned} title="Map" description="Add a Google Maps embed URL for the salon location.">{field("mapEmbedUrl", "Map embed URL", "url", "https://www.google.com/maps/embed?pb=...")}</SettingsSection>
      </form>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return <section className="settings-section"><div className="settings-section__heading"><span className="settings-section__icon"><Icon size={18} /></span><div><h2>{title}</h2><p>{description}</p></div></div><div className="settings-section__body">{children}</div></section>;
}

export default Settings;