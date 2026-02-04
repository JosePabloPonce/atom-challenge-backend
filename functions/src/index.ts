import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";

import { usersRouter } from "./routes/users.routes";
import { tasksRouter } from "./routes/tasks.routes";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/users", usersRouter);

app.use("/tasks", authMiddleware, tasksRouter);

export const api = onRequest(
  {
    secrets: ["JWT_SECRET"],
    region: "us-central1",
  },
  app,
);
