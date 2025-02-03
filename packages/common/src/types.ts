import { z } from "zod"

export const UserSchema = z.object({
  email: z.string().min(6),
  password: z.string().min(6),
  name: z.string(),
});

export const SignInSchema = z.object({
  email: z.string().min(6),
  password: z.string().min(6),
});

export const RoomSchema = z.object({
  name: z.string().min(3),
});
