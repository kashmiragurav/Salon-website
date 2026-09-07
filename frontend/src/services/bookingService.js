import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

import { auth, db } from "../firebase/config";

export const validatePhone = (value) => {
  const phone = String(value || "").trim();
  return /^[+]?[(]?[0-9\s().-]{7,20}$/.test(phone) && phone.replace(/\D/g, "").length >= 7;
};

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
  const gender = String(booking.gender || "").trim();
  const notes = String(booking.notes || "").trim();
  if (!customerName) errors.customerName = "Enter your name.";
  else if (customerName.length > 120) errors.customerName = "Keep your name under 120 characters.";
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!validatePhone(phone)) errors.phone = "Enter a valid phone number.";
  if (!serviceSelected || !String(booking.serviceId || "").trim()) errors.serviceSelected = "Choose a service.";
  if (!gender) errors.gender = "Choose a gender.";
  else if (serviceSelected.length > 160) errors.serviceSelected = "Choose a shorter service name.";
  if (!booking.preferredDate) errors.preferredDate = "Choose a date.";
  else if (!isExactDate || selectedDate < today) errors.preferredDate = "Choose a current or future date.";
  if (!booking.preferredTime) errors.preferredTime = "Choose a time.";
  if (notes.length > 2000) errors.notes = "Keep notes under 2,000 characters.";

  return errors;
};

export const getMyBookings = async (userId) => {
  if (!userId || auth.currentUser?.uid !== userId) throw new Error("A valid signed-in client is required.");
  const snapshot = await getDocs(query(collection(db, "bookings"), where("userId", "==", userId)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() || 0;
    const secondTime = second.createdAt?.toMillis?.() || 0;
    return secondTime - firstTime;
  });
};

export const subscribeToMyBookings = (userId, onData, onError) => {
  if (!userId || auth.currentUser?.uid !== userId) throw new Error("A valid signed-in client is required.");
  return onSnapshot(query(collection(db, "bookings"), where("userId", "==", userId)), (snapshot) => {
    const bookings = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((first, second) => {
      const firstTime = first.createdAt?.toMillis?.() || 0;
      const secondTime = second.createdAt?.toMillis?.() || 0;
      return secondTime - firstTime;
    });
    onData(bookings);
  }, onError);
};

export const getBookingById = async (bookingId) => {
  if (!auth.currentUser?.uid) throw new Error("A signed-in client is required.");
  const snapshot = await getDoc(doc(db, "bookings", bookingId));
  if (!snapshot.exists()) return null;
  const booking = { id: snapshot.id, ...snapshot.data() };
  return booking.userId === auth.currentUser.uid ? booking : null;
};

export const cancelBooking = async (bookingId) => updateDoc(doc(db, "bookings", bookingId), {
  status: "Cancelled",
  updatedAt: serverTimestamp(),
});

export const createBooking = async (booking) => {
  if (!auth.currentUser?.uid) throw new Error("Please sign in before booking an appointment.");
  return addDoc(collection(db, "bookings"), {
  userId: auth.currentUser.uid,
  customerName: booking.customerName.trim(),
  phone: booking.phone.trim(),
  gender: booking.gender.trim(),
  serviceSelected: booking.serviceSelected.trim(),
  serviceId: booking.serviceId.trim(),
  preferredDate: booking.preferredDate,
  preferredTime: booking.preferredTime,
  notes: booking.notes.trim(),
  status: "Pending",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  });
};
