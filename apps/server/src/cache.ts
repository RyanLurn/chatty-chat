import type {
  ChatMessage,
  ChatMessageId,
  ChatMessageReader,
  ChatMessageReaderId,
} from "#data/schema/chat-message";
import type { User, Username } from "#data/schema/user";

export interface Cache {
  users: Map<Username, User>;
  chatMessages: Map<ChatMessageId, ChatMessage>;
  chatMessageReaders: Map<ChatMessageReaderId, ChatMessageReader>;
}

export const cache: Cache = {
  users: new Map(),
  chatMessages: new Map(),
  chatMessageReaders: new Map(),
};
