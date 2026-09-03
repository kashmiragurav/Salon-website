import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const servicesCollection = collection(db, "services");

export const subscribeToServices = (onData, onError) => {
  const servicesQuery = query(servicesCollection, orderBy("name", "asc"));

  return onSnapshot(
    servicesQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

export const createService = async (service) => {
  return addDoc(servicesCollection, {
    name: service.name.trim(),
    category: service.category,
    description: service.description.trim(),
    price: Number(service.price),
    duration: service.duration.trim(),
    imageUrl: service.imageUrl.trim(),
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateService = async (serviceId, service) => {
  return updateDoc(doc(db, "services", serviceId), {
    name: service.name.trim(),
    category: service.category,
    description: service.description.trim(),
    price: Number(service.price),
    duration: service.duration.trim(),
    imageUrl: service.imageUrl.trim(),
    updatedAt: serverTimestamp(),
  });
};

export const deleteService = async (serviceId) => deleteDoc(doc(db, "services", serviceId));

export const setServiceActive = async (serviceId, isActive) => {
  return updateDoc(doc(db, "services", serviceId), {
    isActive,
    updatedAt: serverTimestamp(),
  });
};