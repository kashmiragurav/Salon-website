import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

const servicesCollection = collection(db, "services");

export const getActiveServices = async () => {
  const snapshot = await getDocs(query(servicesCollection, where("isActive", "==", true)));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((first, second) => String(first.name || "").localeCompare(String(second.name || "")));
};
