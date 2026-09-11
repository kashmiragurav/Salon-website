import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const cleanEnvValue = (value) => String(value ?? "").replace(/["',\s]+/g, "").trim();

const firebaseConfig = {
  apiKey: cleanEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
};

const hasMissingConfig = Object.values(firebaseConfig).some((value) => !value);

if (hasMissingConfig) {
  console.error("Firebase config is missing or malformed. Check frontend/.env");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const firebaseReady = !!app && !!auth && !!db && !!storage && !hasMissingConfig;

// Returns the current Firebase user, waiting for auth to fully initialize first.
// Unlike a cached promise, this always reflects the live auth state at call time.
// Safe to call at any point — before or after login.
export function getAuthUser() {
  return new Promise((resolve) => {
    // If auth has already initialized (currentUser is not undefined), return immediately.
    // Firebase sets currentUser to null (not undefined) once initialized.
    if (auth.currentUser !== undefined) {
      resolve(auth.currentUser);
      return;
    }
    // Otherwise wait for the first onAuthStateChanged event.
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

export default app;
