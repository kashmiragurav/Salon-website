import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../firebase/config";

const normalizeGallery = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

export const subscribeToGalleryImages = (onData, onError) => onSnapshot(
  query(collection(db, "gallery"), orderBy("uploadedAt", "desc")),
  (snapshot) => onData(normalizeGallery(snapshot)),
  onError,
);

export const getGalleryImages = async () => {
  const snapshot = await getDocs(query(collection(db, "gallery"), orderBy("uploadedAt", "desc")));
  return normalizeGallery(snapshot);
};
