import type { Branded } from "@chatty-chat/utils/types";
import * as z from "zod";

export type UserId = Branded<string, "UserId">;
export const UserIdSchema = z.custom<UserId>((value) => {
  const validationResult = z.uuidv4().safeParse(value);
  if (!validationResult.success) {
    return false;
  }
  return true;
});

export const UserSchema = z.object({
  name: z.string().min(1).max(16),
  joinedAt: z.int().positive(),
  leftAt: z.int().positive().optional(),
});
export type User = z.infer<typeof UserSchema>;
