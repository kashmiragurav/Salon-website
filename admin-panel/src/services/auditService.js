import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../firebase/config";

const auditCollection = collection(db, "auditLogs");
const validActions = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "STATUS_CHANGE"];

export const AUDIT_ACTIONS = validActions;

export const createAuditLog = async ({ action, module, recordId, description }) => {
  if (!validActions.includes(action)) throw new Error("Invalid audit action.");
  if (!module || !description) throw new Error("Audit module and description are required.");

  return addDoc(auditCollection, {
    adminId: auth.currentUser?.uid || "unknown",
    action,
    module,
    recordId: recordId || "",
    description,
    createdAt: serverTimestamp(),
  });
};