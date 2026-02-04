import { db, serverTimestamp } from "../db/firestore";
import type { Task } from "../domain/task";

const TASKS = "tasks";

function toMillis(value: any): number {
  if (!value) return 0;

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (typeof value._seconds === "number") return value._seconds * 1000;
  if (typeof value.seconds === "number") return value.seconds * 1000;

  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  return 0;
}

export async function listTasksByUser(userId: string): Promise<Task[]> {
  const snap = await db().collection(TASKS).where("userId", "==", userId).get();

  const tasks = snap.docs.map((d) => {
    const data = d.data() as Omit<Task, "id">;
    return { id: d.id, ...data };
  });

  tasks.sort((a: any, b: any) => toMillis(b.createdAt) - toMillis(a.createdAt));

  return tasks;
}

export async function createTask(input: {
  userId: string;
  title: string;
  description: string;
}): Promise<Task> {
  const ref = await db().collection(TASKS).add({
    userId: input.userId,
    title: input.title,
    description: input.description,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const doc = await ref.get();
  const data = doc.data() as Omit<Task, "id">;
  return { id: doc.id, ...data };
}

export async function updateTask(
  taskId: string,
  userId: string,
  patch: Partial<Pick<Task, "title" | "description" | "completed">>,
): Promise<void> {
  const ref = db().collection(TASKS).doc(taskId);
  const snap = await ref.get();

  if (!snap.exists) throw new Error("NOT_FOUND");

  const data = snap.data() as Omit<Task, "id">;
  if (data.userId !== userId) throw new Error("FORBIDDEN");

  await ref.update({
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(
  taskId: string,
  userId: string,
): Promise<void> {
  const ref = db().collection(TASKS).doc(taskId);
  const snap = await ref.get();

  if (!snap.exists) throw new Error("NOT_FOUND");

  const data = snap.data() as Omit<Task, "id">;
  if (data.userId !== userId) throw new Error("FORBIDDEN");

  await ref.delete();
}
