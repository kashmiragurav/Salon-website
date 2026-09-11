import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

const normalizeContent = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((first, second) => {
  const firstTime = first.createdAt?.toMillis?.() || 0;
  const secondTime = second.createdAt?.toMillis?.() || 0;
  return secondTime - firstTime;
});

export const subscribeToActiveContent = (type, onData, onError) => onSnapshot(
  query(collection(db, type), where("isActive", "==", true)),
  (snapshot) => onData(normalizeContent(snapshot)),
  onError,
);

export const getActiveContent = async (type) => {
  const snapshot = await getDocs(query(collection(db, type), where("isActive", "==", true)));
  return normalizeContent(snapshot);
};
