import { io, Socket } from "socket.io-client";

// the API base URL is either an absolute dev URL ("http://localhost:8080/api")
// or a same-origin path in production ("/api", proxied by Nginx) - either
// way, strip the "/api" suffix to get the server origin the socket should
// connect to, since Socket.IO needs an origin, not a path prefix
const apiUrl = import.meta.env.VITE_API_URL || "";
const socketOrigin = apiUrl.startsWith("http")
  ? apiUrl.replace(/\/api\/?$/, "")
  : window.location.origin;

let socket: Socket | null = null;

// returns a singleton, authenticated socket connection - reuses the same
// JWT the REST API uses, and rides the "/api/socket.io" path so it works
// through the same reverse-proxy rule as the REST API in production
export function getSocket(): Socket | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(socketOrigin, {
      path: "/api/socket.io",
      auth: { token },
      transports: ["polling", "websocket"],
    });
  }

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
