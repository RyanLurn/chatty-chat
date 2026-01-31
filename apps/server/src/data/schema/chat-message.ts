import { UserIdSchema } from "#data/schema/user";
import type { Branded } from "@chatty-chat/utils/types";
import * as z from "zod";

export type ChatMessageId = Branded<string, "ChatMessageId">;
export const ChatMessageIdSchema = z.custom<ChatMessageId>((value) => {
  const validationResult = z.uuidv4().safeParse(value);
  if (!validationResult.success) {
    return false;
  }
  return true;
});

export const ChatMessageSchema = z.object({
  senderId: UserIdSchema,
  content: z.string().min(1).max(2048),
  timestamp: z.int().positive(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
