import { cache } from "#cache";
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
      console.log(`${ws.data.username} joined the chat!`);
      cache.users.set(ws.data.username, {
        joinedAt: Date.now(),
      });
    },
    message: (ws, message) => {},
    close: (ws) => {
      console.log(`${ws.data.username} left the chat.`);
      cache.users.delete(ws.data.username);
    },
  },
});

console.log(`Server running at ${server.url}`);
