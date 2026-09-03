import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../firebase/config";
import { createAuditLog } from "./auditService";

const galleryCollection = collection(db, "gallery");
const maximumImageSize = 10 * 1024 * 1024;

export const MAX_IMAGE_SIZE = maximumImageSize;

export const subscribeToGallery = (onData, onError) => {
  const galleryQuery = query(galleryCollection, orderBy("uploadedAt", "desc"));
  return onSnapshot(
    galleryQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};

const validateImage = (file) => {
  if (!file) throw new Error("Please select an image.");
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
  if (file.size > maximumImageSize) throw new Error("Images must be 10 MB or smaller.");
};

const fileName = (file) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  return `${uniqueId}-${safeName}`;
};

export const addGalleryImage = async ({ file, category, caption }) => {
  validateImage(file);
  const storagePath = `gallery/${fileName(file)}`;
  const imageRef = ref(storage, storagePath);

  await uploadBytes(imageRef, file, { contentType: file.type });
  const imageUrl = await getDownloadURL(imageRef);

  try {
    const reference = await addDoc(galleryCollection, {
      imageUrl,
      storagePath,
      category: category.trim(),
      caption: caption.trim(),
      uploadedAt: serverTimestamp(),
    });
    void createAuditLog({ action: "CREATE", module: "Gallery", recordId: reference.id, description: `Added gallery image${category ? ` in ${category}` : ""}.` }).catch(console.error);
    return reference;
  } catch (error) {
    await deleteObject(imageRef).catch(() => undefined);
    throw error;
  }
};

const isMissingStorageObject = (error) => error?.code === "storage/object-not-found";

export const deleteGalleryImage = async (image) => {
  if (image.storagePath) {
    try {
      await deleteObject(ref(storage, image.storagePath));
    } catch (error) {
      if (!isMissingStorageObject(error)) throw error;
    }
  }

  await deleteDoc(doc(db, "gallery", image.id));
  void createAuditLog({ action: "DELETE", module: "Gallery", recordId: image.id, description: "Deleted a gallery image." }).catch(console.error);
};