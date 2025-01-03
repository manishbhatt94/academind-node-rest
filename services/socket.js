const { Server: SocketIOServer } = require('socket.io');

let io = null;

module.exports = {
  init(httpServer) {
    if (io) {
      throw new Error('Socket init can be called only once.');
    }
    io = new SocketIOServer(httpServer, {
      addTrailingSlash: false,
      cors: {
        origin: process.env.FRONTEND_ORIGIN,
      },
    });
    return io;
  },
  getIO() {
    if (!io) {
      throw new Error('Socket.io not initialized. Call init first.');
    }
    return io;
  },
};
