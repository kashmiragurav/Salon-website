import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(8));
const allBookingsQuery = query(collection(db, "bookings"));
const activeServicesQuery = query(collection(db, "services"), where("isActive", "==", true));
const galleryQuery = query(collection(db, "gallery"));

const snapshotItems = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

const createDashboardData = (bookings, allBookings, services, gallery) => ({
  stats: {
    totalBookings: allBookings.length,
    pendingBookings: allBookings.filter((booking) => String(booking.status || "").toLowerCase() === "pending").length,
    activeServices: services.length,
    galleryPhotos: gallery.length,
  },
  recentBookings: bookings,
});

export const getDashboardData = async () => {
  const [bookingsSnapshot, allBookingsSnapshot, servicesSnapshot, gallerySnapshot] = await Promise.all([
    getDocs(bookingsQuery),
    getDocs(allBookingsQuery),
    getDocs(activeServicesQuery),
    getDocs(galleryQuery),
  ]);

  return createDashboardData(
    snapshotItems(bookingsSnapshot),
    snapshotItems(allBookingsSnapshot),
    snapshotItems(servicesSnapshot),
    snapshotItems(gallerySnapshot),
  );
};

export const subscribeToDashboard = (onData, onError) => {
  const snapshots = { bookings: null, allBookings: null, services: null, gallery: null };
  const emit = () => {
    if (Object.values(snapshots).some((snapshot) => !snapshot)) return;
    onData(createDashboardData(
      snapshotItems(snapshots.bookings),
      snapshotItems(snapshots.allBookings),
      snapshotItems(snapshots.services),
      snapshotItems(snapshots.gallery),
    ));
  };

  const unsubscribe = [
    onSnapshot(bookingsQuery, (snapshot) => { snapshots.bookings = snapshot; emit(); }, onError),
    onSnapshot(allBookingsQuery, (snapshot) => { snapshots.allBookings = snapshot; emit(); }, onError),
    onSnapshot(activeServicesQuery, (snapshot) => { snapshots.services = snapshot; emit(); }, onError),
    onSnapshot(galleryQuery, (snapshot) => { snapshots.gallery = snapshot; emit(); }, onError),
  ];

  return () => unsubscribe.forEach((unsubscribeListener) => unsubscribeListener());
};