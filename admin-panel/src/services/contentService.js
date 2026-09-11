import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../firebase/config";
import { createAuditLog } from "./auditService";

export const CONTENT_CONFIG = {
  offers: { label: "Offers", collection: "offers", fields: [
    ["title", "Title", true], ["description", "Description", true], ["imageUrl", "Image URL", false], ["originalPrice", "Original price", false, "number"], ["offerPrice", "Offer price", false, "number"], ["validUntil", "Valid until", false, "date"],
  ] },
  packages: { label: "Packages", collection: "packages", fields: [["title", "Package name", true], ["description", "Description", true], ["servicesIncluded", "Services included", true], ["price", "Price", true, "number"], ["imageUrl", "Image URL", false]] },
  team: { label: "Team", collection: "team", fields: [["name", "Name", true], ["role", "Role", true], ["specialization", "Specialization", false], ["experience", "Experience", false], ["imageUrl", "Image URL", false], ["bio", "Short bio", false]] },
  beforeAfter: { label: "Before & After", collection: "beforeAfter", fields: [["title", "Title", true], ["category", "Category", false], ["beforeImageUrl", "Before image URL", true], ["afterImageUrl", "After image URL", true], ["description", "Description", false]] },
  faqs: { label: "FAQs", collection: "faqs", fields: [["question", "Question", true], ["answer", "Answer", true]] },
};

export const subscribeToContent = (type, onData, onError) => {
  const config = CONTENT_CONFIG[type];
  return onSnapshot(query(collection(db, config.collection), orderBy("createdAt", "desc")), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), onError);
};

export const createContent = async (type, values) => {
  const config = CONTENT_CONFIG[type];
  const reference = await addDoc(collection(db, config.collection), { ...values, isActive: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  void createAuditLog({ action: "CREATE", module: config.label, recordId: reference.id, description: `Created ${config.label.toLowerCase()} record.` }).catch(console.error);
  return reference;
};

export const updateContent = async (type, id, values) => {
  const config = CONTENT_CONFIG[type];
  const result = await updateDoc(doc(db, config.collection, id), { ...values, updatedAt: serverTimestamp() });
  void createAuditLog({ action: "UPDATE", module: config.label, recordId: id, description: `Updated ${config.label.toLowerCase()} record.` }).catch(console.error);
  return result;
};

export const deleteContent = async (type, id) => {
  const config = CONTENT_CONFIG[type];
  const result = await deleteDoc(doc(db, config.collection, id));
  void createAuditLog({ action: "DELETE", module: config.label, recordId: id, description: `Deleted ${config.label.toLowerCase()} record.` }).catch(console.error);
  return result;
};

export const setContentActive = async (type, id, isActive) => updateDoc(doc(db, CONTENT_CONFIG[type].collection, id), { isActive, updatedAt: serverTimestamp() });
