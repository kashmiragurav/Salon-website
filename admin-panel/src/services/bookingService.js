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
import { createAuditLog } from "./auditService";

const bookingsCollection = collection(db, "bookings");
const validStatuses = ["Pending", "Confirmed", "Cancelled"];

export const BOOKING_STATUSES = validStatuses;

export const subscribeToBookings = (onData, onError) => {
  const bookingsQuery = query(bookingsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    bookingsQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

export const updateBookingStatus = async (bookingId, status) => {
  if (!validStatuses.includes(status)) throw new Error("Invalid booking status.");

  const result = await updateDoc(doc(db, "bookings", bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
  void createAuditLog({ action: "STATUS_CHANGE", module: "Appointments", recordId: bookingId, description: `Changed appointment status to ${status}.` }).catch(console.error);
  return result;
};