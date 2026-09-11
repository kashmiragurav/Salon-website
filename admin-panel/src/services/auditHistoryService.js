import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../firebase/config";

export const subscribeToAuditLogs = (onData, onError) => {
  const auditQuery = query(collection(db, "auditLogs"), orderBy("createdAt", "desc"));
  return onSnapshot(
    auditQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError,
  );
};