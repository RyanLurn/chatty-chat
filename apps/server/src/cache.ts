import type { ChatMessage, ChatMessageId } from "#schema";

export const cache: Map<ChatMessageId, ChatMessage> = new Map();
