import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

const servicesCollection = collection(db, "services");

const normalizeServices = (snapshot) => snapshot.docs
  .map((item) => ({ id: item.id, ...item.data() }))
  .sort((first, second) => String(first.name || "").localeCompare(String(second.name || "")));

export const subscribeToActiveServices = (onData, onError) => onSnapshot(
  query(servicesCollection, where("isActive", "==", true)),
  (snapshot) => onData(normalizeServices(snapshot)),
  onError,
);

export const getActiveServices = async () => {
  const snapshot = await getDocs(query(servicesCollection, where("isActive", "==", true)));
  return normalizeServices(snapshot);
};
