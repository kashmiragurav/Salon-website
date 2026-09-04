import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export const getApprovedTestimonials = async () => {
  const snapshot = await getDocs(query(collection(db, "testimonials"), where("isApproved", "==", true)));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((first, second) => String(second.createdAt || "").localeCompare(String(first.createdAt || "")));
};
