import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "../firebase/config";

export const getGalleryImages = async () => {
  const snapshot = await getDocs(query(collection(db, "gallery"), orderBy("uploadedAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};
