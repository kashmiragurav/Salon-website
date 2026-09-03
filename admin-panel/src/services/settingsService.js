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
  salonName: settings.salonName.trim(),
  address: settings.address.trim(),
  phone: settings.phone.trim(),
  whatsappNumber: settings.whatsappNumber.trim(),
  workingHours: settings.workingHours.trim(),
  instagramLink: settings.instagramLink.trim(),
  facebookLink: settings.facebookLink.trim(),
  mapEmbedUrl: settings.mapEmbedUrl.trim(),
  logoUrl: settings.logoUrl.trim(),
  heroImageUrl: settings.heroImageUrl.trim(),
  heroTitle: settings.heroTitle.trim(),
  heroDescription: settings.heroDescription.trim(),
  yearsActive: Number(settings.yearsActive),
  clientsServed: Number(settings.clientsServed),
  staffCount: Number(settings.staffCount),
  updatedAt: serverTimestamp(),
  }, { merge: true });
  void createAuditLog({ action: existingSettings.exists() ? "UPDATE" : "CREATE", module: "Settings", recordId: "salon", description: `${existingSettings.exists() ? "Updated" : "Created"} salon settings.` }).catch(console.error);
  return result;
};