import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/config";

export const createEnquiry = async (enquiry) => addDoc(collection(db, "enquiries"), {
  name: enquiry.name.trim(),
  email: enquiry.email.trim(),
  phone: enquiry.phone.trim(),
  message: enquiry.message.trim(),
  status: "NEW",
  createdAt: serverTimestamp(),
});
