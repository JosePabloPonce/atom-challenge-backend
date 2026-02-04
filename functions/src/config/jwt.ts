import type { Secret, SignOptions } from "jsonwebtoken";

export const jwtSecret: Secret =
  process.env.JWT_SECRET ?? "dev-secret-change-me";

export const jwtSignOptions: SignOptions = {
  expiresIn: "1d",
};
