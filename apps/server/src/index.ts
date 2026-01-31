import { cache } from "#cache";
import type {
  ChatMessage,
  ChatMessageId,
  ChatMessageReaderId,
} from "#data/schema/chat-message";
import { EnvelopeSchema } from "#data/schema/envelope";
import { UsernameSchema } from "#data/schema/user";
import * as z from "zod";

export const WebSocketDataSchema = z.object({
  username: UsernameSchema,
});
export type WebSocketData = z.infer<typeof WebSocketDataSchema>;

const server = Bun.serve({
  routes: {
    "/health": new Response("OK"),
    "/chat": async (request, server) => {
      const requestBody = await request.json();

      const parseResult = WebSocketDataSchema.safeParse(requestBody);
      if (!parseResult.success) {
        return new Response("Invalid request", { status: 400 });
      }
      const data = parseResult.data;

      if (cache.users.has(data.username)) {
        return new Response("Username already exists", { status: 400 });
      }

      if (server.upgrade(request, { data })) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    },
  },
  websocket: {
    data: {} as WebSocketData,
    open: (ws) => {
      cache.users.set(ws.data.username, {
        joinedAt: Date.now(),
      });

      const message = `${ws.data.username} joined the chat!`;
      console.log(message);
      ws.send(message);
    },
    message: (ws, message) => {
      const json = JSON.parse(message.toString());

      const parseResult = EnvelopeSchema.safeParse(json);
      if (!parseResult.success) {
        console.error("Invalid envelope:");
        console.error(z.prettifyError(parseResult.error));
        ws.send(
          JSON.stringify({
            type: "INVALID_ENVELOPE_ERROR",
            message: `${ws.data.username} sent an invalid envelope.`,
          })
        );
        return;
      }

      const envelope = parseResult.data;

      switch (envelope.type) {
        case "SEND_CHAT_MESSAGE": {
          const chatMessage: ChatMessage = {
            sender: ws.data.username,
            content: envelope.payload.content,
            timestamp: Date.now(),
          };

          cache.chatMessages.set(
            crypto.randomUUID() as ChatMessageId,
            chatMessage
          );

          break;
        }
        case "READ_CHAT_MESSAGE":
          const chatMessageId = envelope.payload.chatMessageId;
          if (!cache.chatMessages.has(chatMessageId)) {
            console.error(
              `Could not find chat message with id ${chatMessageId}`
            );
            ws.send(
              JSON.stringify({
                type: "CHAT_MESSAGE_NOT_FOUND_ERROR",
                message: `${ws.data.username} reads an invalid chat message id.`,
              })
            );
            return;
          }

          cache.chatMessageReaders.set(
            crypto.randomUUID() as ChatMessageReaderId,
            {
              chatMessageId,
              reader: ws.data.username,
              readAt: Date.now(),
            }
          );
          break;
      }
    },
    close: (ws) => {
      cache.users.delete(ws.data.username);

      const message = `${ws.data.username} left the chat.`;
      console.log(message);
      ws.send(message);
    },
  },
});

console.log(`Server running at ${server.url}`);
