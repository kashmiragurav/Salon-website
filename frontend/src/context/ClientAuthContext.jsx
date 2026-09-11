import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { ClientAuthContext } from "./clientAuth";
import { createClientProfile } from "../services/userService";

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires once auth initializes (with null or the restored user),
    // then again on every login/logout. This is the single source of truth for auth state.
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signup = async (profile) => {
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

  return (
    <ClientAuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
}
