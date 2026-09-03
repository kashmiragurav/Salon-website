import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const enquiriesCollection = collection(db, "enquiries");
const validStatuses = ["NEW", "READ", "RESPONDED", "CLOSED"];

export const ENQUIRY_STATUSES = validStatuses;

export const subscribeToEnquiries = (onData, onError) => {
  const enquiriesQuery = query(enquiriesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    enquiriesQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

export const updateEnquiryStatus = async (enquiryId, status) => {
  if (!validStatuses.includes(status)) throw new Error("Invalid enquiry status.");

  return updateDoc(doc(db, "enquiries", enquiryId), {
    status,
    updatedAt: serverTimestamp(),
  });
};