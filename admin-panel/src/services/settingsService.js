import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../firebase/config";
import { createAuditLog } from "./auditService";

const settingsReference = doc(db, "settings", "salon");

export const getSalonSettings = async () => {
  const snapshot = await getDoc(settingsReference);
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveSalonSettings = async (settings) => {
  const existingSettings = await getDoc(settingsReference);
  const result = await setDoc(settingsReference, {
  salonName: String(settings.salonName || "").trim(),
  address: String(settings.address || "").trim(),
  phone: String(settings.phone || "").trim(),
  whatsappNumber: String(settings.whatsappNumber || "").trim(),
  workingHours: String(settings.workingHours || "").trim(),
  instagramLink: String(settings.instagramLink || "").trim(),
  facebookLink: String(settings.facebookLink || "").trim(),
  mapEmbedUrl: String(settings.mapEmbedUrl || "").trim(),
  logoUrl: String(settings.logoUrl || "").trim(),
  heroImageUrl: String(settings.heroImageUrl || "").trim(),
  heroTitle: String(settings.heroTitle || "").trim(),
  heroDescription: String(settings.heroDescription || "").trim(),
  aboutTitle: String(settings.aboutTitle || "").trim(),
  aboutShortDescription: String(settings.aboutShortDescription || "").trim(),
  aboutDescription: String(settings.aboutDescription || "").trim(),
  aboutImageUrl: String(settings.aboutImageUrl || "").trim(),
  mission: String(settings.mission || "").trim(),
  vision: String(settings.vision || "").trim(),
  yearsActive: Number(settings.yearsActive || 0),
  clientsServed: Number(settings.clientsServed || 0),
  staffCount: Number(settings.staffCount || 0),
  updatedAt: serverTimestamp(),
  }, { merge: true });
  void createAuditLog({ action: existingSettings.exists() ? "UPDATE" : "CREATE", module: "Settings", recordId: "salon", description: `${existingSettings.exists() ? "Updated" : "Created"} salon settings.` }).catch(console.error);
  return result;
};