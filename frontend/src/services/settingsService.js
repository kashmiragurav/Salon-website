import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/config";

export const getSalonSettings = async () => {
  const snapshot = await getDoc(doc(db, "settings", "salon"));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};
