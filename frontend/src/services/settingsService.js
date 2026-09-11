import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/config";

export const getSalonSettings = async () => {
  const snapshot = await getDoc(doc(db, "settings", "salon"));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const subscribeSalonSettings = (onData, onError) => onSnapshot(
  doc(db, "settings", "salon"),
  (snapshot) => onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null),
  onError,
);
