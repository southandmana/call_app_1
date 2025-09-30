const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

// Debug: Log environment variables on startup
console.log('🔧 Environment variables loaded:');
console.log('  NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION:', process.env.NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION);
console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const httpServer = createServer((req, res) => {
  // Health check endpoint for Railway
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Simple queue for matching users
let waitingQueue = [];
let activeConnections = new Map(); // socketId -> { peerId, roomId }

// Function to broadcast user count to all clients
function broadcastUserCount() {
  const userCount = io.engine.clientsCount;
  io.emit('user-count', userCount);
  console.log('Broadcasting user count:', userCount);
}

// Function to check if two users' filters are compatible
function areFiltersCompatible(filters1, filters2) {
  // If both have interests, they must share at least one
  if (filters1.interests.length > 0 && filters2.interests.length > 0) {
    const hasCommonInterest = filters1.interests.some(interest =>
      filters2.interests.includes(interest)
    );
    if (!hasCommonInterest) {
      console.log('No common interests');
      return false;
    }
  }

  // Check preferred countries (if user1 has preferred, user2 must be from one of them)
  // Note: We don't have user countries yet, so we'll skip this for now
  // TODO: Add country detection or user selection

  // Check non-preferred countries (never match with users from these countries)
  // Note: We don't have user countries yet, so we'll skip this for now
  // TODO: Add country detection or user selection

  return true;
}

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Feature flag: bypass phone verification for testing
  const bypassVerification = process.env.NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION === 'true';

  if (bypassVerification) {
    console.log('🚧 Phone verification bypassed (feature flag enabled) for:', socket.id);
  } else {
    // Validate session authentication
    const sessionId = socket.handshake.auth.sessionId;

    if (!sessionId) {
      console.log('Connection rejected: No session ID provided');
      socket.emit('auth-required', { message: 'Phone verification required' });
      socket.disconnect();
      return;
    }

    // Verify session with Supabase
    try {
      const { data: session, error } = await supabase
        .from('sessions')
        .select('phone_verified')
        .eq('session_id', sessionId)
        .single();

      if (error || !session || !session.phone_verified) {
        console.log('Connection rejected: Invalid or unverified session');
        socket.emit('auth-required', { message: 'Phone verification required' });
        socket.disconnect();
        return;
      }

      console.log('User authenticated successfully:', socket.id);
    } catch (error) {
      console.error('Auth validation error:', error);
      socket.emit('auth-required', { message: 'Authentication error' });
      socket.disconnect();
      return;
    }
  }

  // Broadcast updated user count
  broadcastUserCount();

  // Handle user joining the queue
  socket.on('join-queue', (filters) => {
    console.log('User joined queue:', socket.id, 'with filters:', filters);

    // Store filters with the socket
    socket.userFilters = filters || { interests: [], preferredCountries: [], nonPreferredCountries: [] };

    // Try to find a compatible match
    let matchedIndex = -1;
    for (let i = 0; i < waitingQueue.length; i++) {
      const waitingUser = waitingQueue[i];
      if (areFiltersCompatible(socket.userFilters, waitingUser.userFilters)) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex !== -1) {
      // Found a compatible match
      const waitingUser = waitingQueue.splice(matchedIndex, 1)[0];
      const roomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

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

    // Broadcast updated user count
    broadcastUserCount();
  });
});

// Railway assigns PORT dynamically, fallback to 3001 for local dev
const PORT = process.env.PORT || process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
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