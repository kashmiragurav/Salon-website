import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../firebase/config";
import { createAuditLog } from "./auditService";

const galleryCollection = collection(db, "gallery");
export const subscribeToGallery = (onData, onError) => {
  const galleryQuery = query(galleryCollection, orderBy("uploadedAt", "desc"));
  return onSnapshot(
    galleryQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

const validateImageUrl = (imageUrl) => {
  try {
    const parsedUrl = new URL(imageUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    throw new Error("Please enter a valid image URL.");
  }
};

export const addGalleryImage = async ({ imageUrl, category, caption }) => {
  validateImageUrl(imageUrl.trim());
  const reference = await addDoc(galleryCollection, {
    imageUrl: imageUrl.trim(),
    category: category.trim(),
    caption: caption.trim(),
    isActive: true,
    uploadedAt: serverTimestamp(),
  });
  void createAuditLog({ action: "CREATE", module: "Gallery", recordId: reference.id, description: `Added gallery image${category ? ` in ${category}` : ""}.` }).catch(console.error);
  return reference;
};

export const updateGalleryImage = async (imageId, { imageUrl, category, caption }) => {
  validateImageUrl(imageUrl.trim());
  const result = await updateDoc(doc(db, "gallery", imageId), { imageUrl: imageUrl.trim(), category: category.trim(), caption: caption.trim(), updatedAt: serverTimestamp() });
  void createAuditLog({ action: "UPDATE", module: "Gallery", recordId: imageId, description: "Updated a gallery image." }).catch(console.error);
  return result;
};

export const deleteGalleryImage = async (image) => {
  await deleteDoc(doc(db, "gallery", image.id));
  void createAuditLog({ action: "DELETE", module: "Gallery", recordId: image.id, description: "Deleted a gallery image." }).catch(console.error);
};