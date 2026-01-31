import {
  ChatMessageReaderSchema,
  ChatMessageSchema,
} from "#data/schema/chat-message";
import * as z from "zod";

export const EnvelopeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("SEND_CHAT_MESSAGE"),
    payload: ChatMessageSchema.pick({ content: true }),
  }),
  z.object({
    type: z.literal("READ_CHAT_MESSAGE"),
    payload: ChatMessageReaderSchema.pick({ chatMessageId: true }),
  }),
]);

export type Envelope = z.infer<typeof EnvelopeSchema>;
