import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

export const loginAdmin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const adminRef = doc(
    db,
    "adminUsers",
    user.uid
  );

  const adminSnapshot = await getDoc(adminRef);

  if (!adminSnapshot.exists()) {
    await signOut(auth);

    throw new Error(
      "You are not authorized as an admin."
    );
  }

  const adminData = adminSnapshot.data();

  if (adminData.role !== "admin") {
    await signOut(auth);

    throw new Error(
      "You do not have admin permission."
    );
  }

  if (adminData.isActive !== true) {
    await signOut(auth);

    throw new Error(
      "Your admin account is inactive."
    );
  }

  return {
    uid: user.uid,
    email: user.email,
    ...adminData,
  };
};

export const logoutAdmin = async () => {
  await signOut(auth);
};