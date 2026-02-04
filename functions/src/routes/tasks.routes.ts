import { Router } from "express";
import { z } from "zod";
import {
  listTasksByUser,
  createTask,
  updateTask,
  deleteTask,
} from "../repositories/tasks.repo";

export const tasksRouter = Router();

const createSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().max(200).optional().default(""),
});

const updateSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  description: z.string().max(200).optional(),
  completed: z.boolean().optional(),
});

function toIso(value: any): string | null {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value._seconds === "number") {
    return new Date(value._seconds * 1000).toISOString();
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }

  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  return null;
}

function serializeTask(t: any) {
  return {
    ...t,
    createdAt: toIso(t.createdAt),
    updatedAt: toIso(t.updatedAt),
  };
}

tasksRouter.get("/", async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await listTasksByUser(userId);
    return res.json({ tasks: tasks.map(serializeTask) });
  } catch (e) {
    console.error("GET /tasks error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

tasksRouter.post("/", async (req, res) => {
  const userId = req.auth!.userId;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid payload" });

  const task = await createTask({
    userId,
    title: parsed.data.title,
    description: parsed.data.description,
  });

  return res.status(201).json({ task: serializeTask(task) });
});

tasksRouter.put("/:id", async (req, res) => {
  const userId = req.auth!.userId;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid payload" });

  try {
    await updateTask(req.params.id, userId, parsed.data);
    return res.status(204).send();
  } catch (e: any) {
    if (e.message === "NOT_FOUND")
      return res.status(404).json({ message: "Task not found" });
    if (e.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });
    return res.status(500).json({ message: "Server error" });
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  const userId = req.auth!.userId;

  try {
    await deleteTask(req.params.id, userId);
    return res.status(204).send();
  } catch (e: any) {
    if (e.message === "NOT_FOUND")
      return res.status(404).json({ message: "Task not found" });
    if (e.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });
    return res.status(500).json({ message: "Server error" });
  }
});
