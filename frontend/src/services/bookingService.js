import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/config";

export const createBooking = async (booking) => addDoc(collection(db, "bookings"), {
  name: booking.name.trim(),
  email: booking.email.trim(),
  phone: booking.phone.trim(),
  service: booking.service.trim(),
  preferredDate: booking.preferredDate,
  preferredTime: booking.preferredTime,
  notes: booking.notes.trim(),
  status: "Pending",
  createdAt: serverTimestamp(),
});
