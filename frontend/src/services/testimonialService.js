import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db, getAuthUser } from "../firebase/config";

const normalizeTestimonials = (snapshot) => snapshot.docs
  .map((item) => ({ id: item.id, ...item.data() }))
  .sort((a, b) => {
    const at = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
    const bt = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
    return bt - at;
  });

export const subscribeToApprovedTestimonials = (onData, onError) => onSnapshot(
  query(collection(db, "testimonials"), where("isApproved", "==", true)),
  (snapshot) => onData(normalizeTestimonials(snapshot)),
  onError,
);

export const getApprovedTestimonials = async () => {
  const snapshot = await getDocs(query(collection(db, "testimonials"), where("isApproved", "==", true)));
  return normalizeTestimonials(snapshot);
};

export const createClientTestimonial = async ({ clientName, email = "", rating, reviewText, photoUrl = "", userId }) => {
  // Ensure auth is initialized and the token is attached before writing.
  const user = await getAuthUser();
  if (!user?.uid) throw new Error("Please sign in to submit a review.");
  // Always use the live UID from auth — never trust the passed-in userId alone.
  return addDoc(collection(db, "testimonials"), {
    clientName: clientName.trim(),
    email: String(email).trim(),
    rating: Number(rating),
    reviewText: reviewText.trim(),
    photoUrl: photoUrl.trim(),
    userId: user.uid,
    isApproved: false,
    createdAt: serverTimestamp(),
  });
};
