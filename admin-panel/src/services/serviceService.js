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
import { createAuditLog } from "./auditService";

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
  const reference = await addDoc(servicesCollection, {
    name: service.name.trim(),
    category: service.category,
    description: service.description.trim(),
    price: Number(service.price),
    durationMinutes: Number(service.durationMinutes),
    imageUrl: service.imageUrl.trim(),
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  void createAuditLog({ action: "CREATE", module: "Services", recordId: reference.id, description: `Created service ${service.name.trim()}.` }).catch(console.error);
  return reference;
};

export const updateService = async (serviceId, service) => {
  const result = await updateDoc(doc(db, "services", serviceId), {
    name: service.name.trim(),
    category: service.category,
    description: service.description.trim(),
    price: Number(service.price),
    durationMinutes: Number(service.durationMinutes),
    imageUrl: service.imageUrl.trim(),
    updatedAt: serverTimestamp(),
  });
  void createAuditLog({ action: "UPDATE", module: "Services", recordId: serviceId, description: `Updated service ${service.name.trim()}.` }).catch(console.error);
  return result;
};

export const deleteService = async (serviceId) => {
  const result = await deleteDoc(doc(db, "services", serviceId));
  void createAuditLog({ action: "DELETE", module: "Services", recordId: serviceId, description: "Deleted a service." }).catch(console.error);
  return result;
};

export const setServiceActive = async (serviceId, isActive) => {
  const result = await updateDoc(doc(db, "services", serviceId), {
    isActive,
    updatedAt: serverTimestamp(),
  });
  void createAuditLog({ action: "STATUS_CHANGE", module: "Services", recordId: serviceId, description: `Changed service status to ${isActive ? "active" : "inactive"}.` }).catch(console.error);
  return result;
};