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

const testimonialsCollection = collection(db, "testimonials");

export const subscribeToTestimonials = (onData, onError) => {
  const testimonialsQuery = query(testimonialsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    testimonialsQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

export const createTestimonial = async (testimonial) => addDoc(testimonialsCollection, {
  clientName: testimonial.clientName.trim(),
  rating: Number(testimonial.rating),
  reviewText: testimonial.reviewText.trim(),
  photoUrl: testimonial.photoUrl.trim(),
  isApproved: false,
  createdAt: serverTimestamp(),
});

export const updateTestimonial = async (testimonialId, testimonial) => updateDoc(doc(db, "testimonials", testimonialId), {
  clientName: testimonial.clientName.trim(),
  rating: Number(testimonial.rating),
  reviewText: testimonial.reviewText.trim(),
  photoUrl: testimonial.photoUrl.trim(),
});

export const deleteTestimonial = async (testimonialId) => deleteDoc(doc(db, "testimonials", testimonialId));

export const setTestimonialApproval = async (testimonialId, isApproved) => updateDoc(doc(db, "testimonials", testimonialId), {
  isApproved,
});