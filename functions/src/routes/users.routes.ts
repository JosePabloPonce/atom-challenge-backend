import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { jwtSecret, jwtSignOptions } from "../config/jwt";
import { createUser, findUserByEmail } from "../repositories/users.repo";

export const usersRouter = Router();

const emailSchema = z.string().trim().toLowerCase().email();

usersRouter.get("/", async (req, res) => {
  const raw = String(req.query.email || "");
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success)
    return res.status(400).json({ message: "Email required" });

  const email = parsed.data;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    jwtSecret,
    jwtSignOptions,
  );

  return res.json({ user: { id: user.id, email: user.email }, token });
});

usersRouter.post("/", async (req, res) => {
  const raw = String(req.body?.email || "");
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success)
    return res.status(400).json({ message: "Email required" });

  const email = parsed.data;

  const existing = await findUserByEmail(email);
  const user = existing ?? (await createUser(email));

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    jwtSecret,
    jwtSignOptions,
  );

  return res
    .status(existing ? 200 : 201)
    .json({ user: { id: user.id, email: user.email }, token });
});
