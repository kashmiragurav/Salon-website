import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export const getApprovedTestimonials = async () => {
  const snapshot = await getDocs(query(collection(db, "testimonials"), where("isApproved", "==", true)));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((first, second) => {
      const firstTime = first.createdAt?.toMillis?.() || new Date(first.createdAt || 0).getTime();
      const secondTime = second.createdAt?.toMillis?.() || new Date(second.createdAt || 0).getTime();
      return secondTime - firstTime;
    });
};
