import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export const getActiveContent = async (type) => {
  const snapshot = await getDocs(query(collection(db, type), where("isActive", "==", true), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};
