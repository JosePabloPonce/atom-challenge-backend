import { db, serverTimestamp } from "../db/firestore";
import type { User } from "../domain/user";

const USERS = "users";

export async function findUserByEmail(email: string): Promise<User | null> {
  const snap = await db()
    .collection(USERS)
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  const data = doc.data() as Omit<User, "id">;
  return { id: doc.id, ...data };
}

export async function createUser(email: string): Promise<User> {
  const ref = await db().collection(USERS).add({
    email,
    createdAt: serverTimestamp(),
  });

  const doc = await ref.get();
  const data = doc.data() as Omit<User, "id">;
  return { id: doc.id, ...data };
}
