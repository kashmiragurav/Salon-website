import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { createAuditLog } from "./auditService";

const testimonialsCollection = collection(db, "testimonials");

export const subscribeToTestimonials = (onData, onError) => {
  const testimonialsQuery = query(testimonialsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    testimonialsQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

export const createTestimonial = async (testimonial) => {
  const reference = await addDoc(testimonialsCollection, {
  clientName: testimonial.clientName.trim(),
  rating: Number(testimonial.rating),
  reviewText: testimonial.reviewText.trim(),
  photoUrl: testimonial.photoUrl.trim(),
  isApproved: false,
  createdAt: serverTimestamp(),
  });
  void createAuditLog({ action: "CREATE", module: "Testimonials", recordId: reference.id, description: `Created testimonial from ${testimonial.clientName.trim()}.` }).catch(console.error);
  return reference;
};

export const updateTestimonial = async (testimonialId, testimonial) => {
  const result = await updateDoc(doc(db, "testimonials", testimonialId), {
  clientName: testimonial.clientName.trim(),
  rating: Number(testimonial.rating),
  reviewText: testimonial.reviewText.trim(),
  photoUrl: testimonial.photoUrl.trim(),
  });
  void createAuditLog({ action: "UPDATE", module: "Testimonials", recordId: testimonialId, description: `Updated testimonial from ${testimonial.clientName.trim()}.` }).catch(console.error);
  return result;
};

export const deleteTestimonial = async (testimonialId) => {
  const result = await deleteDoc(doc(db, "testimonials", testimonialId));
  void createAuditLog({ action: "DELETE", module: "Testimonials", recordId: testimonialId, description: "Deleted a testimonial." }).catch(console.error);
  return result;
};

export const setTestimonialApproval = async (testimonialId, isApproved) => {
  const result = await updateDoc(doc(db, "testimonials", testimonialId), { isApproved });
  void createAuditLog({ action: isApproved ? "APPROVE" : "REJECT", module: "Testimonials", recordId: testimonialId, description: `${isApproved ? "Approved" : "Rejected"} a testimonial.` }).catch(console.error);
  return result;
};