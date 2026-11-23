const { Server } = require("socket.io");
const { verifyToken } = require("./jwtUtils");
const logger = require("./logger");

let io = null;

// attaches a Socket.IO server to the existing HTTP server, authenticating
// each connection with the same JWT the REST API uses, and placing the
// socket in a per-user room so notifications can be pushed to exactly the
// right person in real time.
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    // rides the same "/api" prefix the REST API is reverse-proxied under in
    // production, and falls back to long-polling (no WebSocket upgrade
    // required) if the proxy doesn't forward the Upgrade header
    path: "/api/socket.io",
    cors: { origin: true, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    const decoded = verifyToken(token);
    if (!decoded) return next(new Error("Unauthorized"));
    socket.userId = decoded.id;
    next();
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
    logger.info(`Socket connected for user ${socket.userId}`);

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected for user ${socket.userId}`);
    });
  });

  return io;
};

// push an event to every open connection for a given user; a no-op if the
// socket server hasn't been initialized (e.g. in tests) or the user isn't
// currently connected
const emitToUser = (userId, event, payload) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};

module.exports = { initSocket, emitToUser };
