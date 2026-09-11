import {
  useEffect,
  useState,
} from "react";

import { AuthContext } from "./authContext";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          if (!user) {
            setAdmin(null);
            setLoading(false);
            return;
          }

          const adminRef = doc(
            db,
            "adminUsers",
            user.uid
          );

          const snapshot = await getDoc(adminRef);

          if (!snapshot.exists()) {
            await signOut(auth);
            setAdmin(null);
            setLoading(false);
            return;
          }

          const data = snapshot.data();

          if (
            data.role !== "admin" ||
            data.isActive !== true
          ) {
            await signOut(auth);
            setAdmin(null);
            setLoading(false);
            return;
          }

          setAdmin({
            uid: user.uid,
            email: user.email,
            ...data,
          });

          setLoading(false);
        } catch (error) {
          console.error(error);

          setAdmin(null);
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        setAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
