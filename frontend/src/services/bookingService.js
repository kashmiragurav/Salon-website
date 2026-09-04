import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/config";

export const validateBooking = (booking) => {
  const errors = {};
  const phone = String(booking.phone || "").trim();
  const selectedDate = booking.preferredDate ? new Date(`${booking.preferredDate}T00:00:00`) : null;
  const dateParts = String(booking.preferredDate || "").split("-").map(Number);
  const isExactDate = dateParts.length === 3 && dateParts.every(Number.isInteger)
    && selectedDate?.getFullYear() === dateParts[0]
    && selectedDate?.getMonth() === dateParts[1] - 1
    && selectedDate?.getDate() === dateParts[2];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const customerName = String(booking.customerName || "").trim();
  const serviceSelected = String(booking.serviceSelected || "").trim();
  const notes = String(booking.notes || "").trim();
  if (!customerName) errors.customerName = "Enter your name.";
  else if (customerName.length > 120) errors.customerName = "Keep your name under 120 characters.";
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!/^[+]?[(]?[0-9\s().-]{7,20}$/.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (!serviceSelected || !String(booking.serviceId || "").trim()) errors.serviceSelected = "Choose a service.";
  else if (serviceSelected.length > 160) errors.serviceSelected = "Choose a shorter service name.";
  if (!booking.preferredDate) errors.preferredDate = "Choose a date.";
  else if (!isExactDate || selectedDate < today) errors.preferredDate = "Choose a current or future date.";
  if (!booking.preferredTime) errors.preferredTime = "Choose a time.";
  if (notes.length > 2000) errors.notes = "Keep notes under 2,000 characters.";

  return errors;
};

export const createBooking = async (booking) => addDoc(collection(db, "bookings"), {
  customerName: booking.customerName.trim(),
  phone: booking.phone.trim(),
  serviceSelected: booking.serviceSelected.trim(),
  serviceId: booking.serviceId.trim(),
  preferredDate: booking.preferredDate,
  preferredTime: booking.preferredTime,
  notes: booking.notes.trim(),
  status: "Pending",
  createdAt: serverTimestamp(),
});
