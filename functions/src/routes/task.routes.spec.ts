import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";

import { tasksRouter } from "./tasks.routes";
import { authMiddleware } from "../middleware/auth";
import { jwtSecret } from "../config/jwt";

jest.mock("../repositories/tasks.repo", () => ({
  listTasksByUser: async () => [
    {
      id: "t1",
      userId: "u1",
      title: "Task 1",
      description: "Desc",
      completed: false,
      createdAt: { _seconds: 1, _nanoseconds: 0 },
      updatedAt: { _seconds: 1, _nanoseconds: 0 },
    },
  ],
  createTask: async () => ({}),
  updateTask: async () => undefined,
  deleteTask: async () => undefined,
}));

describe("Tasks API", () => {
  const app = express();
  app.use(express.json());
  app.use("/tasks", authMiddleware, tasksRouter);

  it("GET /tasks sin token => 401", async () => {
    await request(app).get("/tasks").expect(401);
  });

  it("GET /tasks con token => 200", async () => {
    const token = jwt.sign({ userId: "u1", email: "test@mail.com" }, jwtSecret);

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks[0].id).toBe("t1");
  });
});
