import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { ClientAuthContext } from "./clientAuth";

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setLoading(false); }), []);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  return <ClientAuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</ClientAuthContext.Provider>;
}

