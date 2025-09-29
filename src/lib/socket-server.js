const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Simple queue for matching users
let waitingQueue = [];
let activeConnections = new Map(); // socketId -> { peerId, roomId }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining the queue
  socket.on('join-queue', () => {
    console.log('User joined queue:', socket.id);

    // Check if there's someone waiting
    if (waitingQueue.length > 0) {
      // Match with the first person in queue
      const waitingUser = waitingQueue.shift();
      const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create room and add both users
      socket.join(roomId);
      waitingUser.join(roomId);

      // Store connection info
      activeConnections.set(socket.id, { peerId: waitingUser.id, roomId });
      activeConnections.set(waitingUser.id, { peerId: socket.id, roomId });

      // Notify both users they've been matched
      socket.emit('matched', {
        roomId,
        peerId: waitingUser.id,
        isInitiator: true
      });

      waitingUser.emit('matched', {
        roomId,
        peerId: socket.id,
        isInitiator: false
      });

      console.log(`Matched ${socket.id} with ${waitingUser.id} in room ${roomId}`);
    } else {
      // Add to waiting queue
      waitingQueue.push(socket);
      socket.emit('waiting');
      console.log('Added to queue, waiting for match...');
    }
  });

  // Handle WebRTC signaling
  socket.on('signal', (data) => {
    const connection = activeConnections.get(socket.id);
    if (connection) {
      // Forward signal to the peer
      socket.to(connection.peerId).emit('signal', {
        signal: data.signal,
        from: socket.id
      });
      console.log(`Forwarded signal from ${socket.id} to ${connection.peerId}`);
    }
  });

  // Handle leaving queue
  socket.on('leave-queue', () => {
    // Remove from waiting queue
    const queueIndex = waitingQueue.findIndex(s => s.id === socket.id);
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1);
      console.log('User left queue:', socket.id);
    }
  });

  // Handle ending call
  socket.on('end-call', () => {
    const connection = activeConnections.get(socket.id);
    if (connection) {
      // Notify peer that call ended
      socket.to(connection.peerId).emit('call-ended');

      // Clean up connections
      activeConnections.delete(socket.id);
      activeConnections.delete(connection.peerId);

      // Leave room
      socket.leave(connection.roomId);

      console.log(`Call ended between ${socket.id} and ${connection.peerId}`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove from waiting queue
    const queueIndex = waitingQueue.findIndex(s => s.id === socket.id);
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1);
    }

    // Handle active connection cleanup
    const connection = activeConnections.get(socket.id);
    if (connection) {
      // Notify peer about disconnection
      socket.to(connection.peerId).emit('peer-disconnected');

      // Clean up peer's connection too
      activeConnections.delete(connection.peerId);
      activeConnections.delete(socket.id);
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Process terminated');
  });
});