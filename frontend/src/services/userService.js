import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const createClientProfile = async (user, profile) => setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  name: profile.name.trim(),
  email: user.email,
  phone: profile.phone.trim(),
  role: "client",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const getClientProfile = async (userId) => {
  const snapshot = await getDoc(doc(db, "users", userId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateClientProfile = async (userId, profile) => updateDoc(doc(db, "users", userId), {
  name: profile.name.trim(),
  phone: profile.phone.trim(),
  updatedAt: serverTimestamp(),
});
