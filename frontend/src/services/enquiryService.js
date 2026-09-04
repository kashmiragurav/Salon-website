import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/config";

export const validateEnquiry = (enquiry) => {
  const errors = {};
  const email = String(enquiry.email || "").trim();
  const phone = String(enquiry.phone || "").trim();
  if (!String(enquiry.name || "").trim()) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!/^[+]?[(]?[0-9\s().-]{7,20}$/.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (!String(enquiry.subject || "").trim()) errors.subject = "Enter a subject.";
  if (!String(enquiry.message || "").trim()) errors.message = "Enter a message.";
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
