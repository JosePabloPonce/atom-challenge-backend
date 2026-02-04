import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Firestore } from "firebase-admin/firestore";

let _db: Firestore | null = null;

export function db(): Firestore {
  if (_db) return _db;

  if (!getApps().length) {
    initializeApp();
  }

  _db = getFirestore();
  return _db;
}

export function serverTimestamp() {
  return FieldValue.serverTimestamp();
}
