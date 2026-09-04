import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/config";

export const validateEnquiry = (enquiry) => {
  const errors = {};
  const email = String(enquiry.email || "").trim();
  const phone = String(enquiry.phone || "").trim();
  if (!String(enquiry.name || "").trim()) errors.name = "Enter your name.";
  else if (String(enquiry.name).trim().length > 120) errors.name = "Keep your name under 120 characters.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!/^[+]?[(]?[0-9\s().-]{7,20}$/.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (email.length > 254) errors.email = "Keep your email under 254 characters.";
  if (String(enquiry.subject || "").trim().length > 200) errors.subject = "Keep your subject under 200 characters.";
  if (!String(enquiry.subject || "").trim()) errors.subject = "Enter a subject.";
  if (!String(enquiry.message || "").trim()) errors.message = "Enter a message.";
  else if (String(enquiry.message).trim().length > 4000) errors.message = "Keep your message under 4,000 characters.";
  return errors;
};

export const createEnquiry = async (enquiry) => addDoc(collection(db, "enquiries"), {
  name: enquiry.name.trim(),
  email: enquiry.email.trim(),
  phone: enquiry.phone.trim(),
  subject: enquiry.subject.trim(),
  message: enquiry.message.trim(),
  status: "NEW",
  createdAt: serverTimestamp(),
});
