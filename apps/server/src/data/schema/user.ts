import type { Branded } from "@chatty-chat/utils/types";
import * as z from "zod";

export type Username = Branded<string, "Username">;
export const UsernameSchema = z.custom<Username>((value) => {
  const validationResult = z.string().min(1).max(32).safeParse(value);
  if (!validationResult.success) {
    return false;
  }
  return true;
});

export const UserSchema = z.object({
  joinedAt: z.int().positive(),
  leftAt: z.int().positive().optional(),
});
export type User = z.infer<typeof UserSchema>;
