import { serverPort } from "@chatty-chat/server/constants";

const socket = new WebSocket(`ws://localhost:${serverPort}`);

socket.addEventListener("open", () => {
  console.log("CONNECTED");
  const pingInterval = setInterval(() => {
    console.log("SENT: ping");
    socket.send("ping");
  }, 1000);
});

socket.addEventListener("message", (event) => {
  console.log("Message from server:", event.data);
  socket.send("Hello from client!");
});

socket.addEventListener("close", () => {
  console.log("Disconnected from server.");
});

while (true) {
  Bun.sleepSync(1000);
  console.log("Heartbeat");
}
