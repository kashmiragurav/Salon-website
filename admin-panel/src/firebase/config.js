import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
  console.error("Firebase config is missing or malformed. Check admin-panel/.env");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseReady = !!app && !!auth && !!db && !hasMissingConfig;

export default app;