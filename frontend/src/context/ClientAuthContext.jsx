import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, authPersistenceReady } from "../firebase/config";
import { ClientAuthContext } from "./clientAuth";
import { createClientProfile } from "../services/userService";

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setLoading(false); }), []);
  const login = async (email, password) => { await authPersistenceReady; return signInWithEmailAndPassword(auth, email, password); };
  const signup = async (profile) => {
    await authPersistenceReady;
    const credential = await createUserWithEmailAndPassword(auth, profile.email.trim(), profile.password);
    try {
      await createClientProfile(credential.user, profile);
    } catch (error) {
      await deleteUser(credential.user).catch(() => undefined);
      throw error;
    }
    return credential;
  };
  const logout = () => signOut(auth);
  return <ClientAuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</ClientAuthContext.Provider>;
}

