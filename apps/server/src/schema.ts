import * as z from "zod";

export const ChatMessageSchema = z.object({
  sender: z.string().min(1).max(16),
  content: z.string().min(1).max(2048),
  timestamp: z.int().positive(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
