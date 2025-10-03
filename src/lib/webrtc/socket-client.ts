import { io, Socket } from 'socket.io-client';

export type MatchingState = 'idle' | 'searching' | 'matched';

export interface SocketManager {
  socket: Socket | null;
  isConnected: boolean;
  onMatched?: (data: { roomId: string; peerId: string; isInitiator: boolean }) => void;
  onWaiting?: () => void;
  onSignal?: (data: { signal: any; from: string }) => void;
  onCallEnded?: () => void;
  onPeerDisconnected?: () => void;
  onUserCount?: (count: number) => void;
  onAuthRequired?: (data: { message: string }) => void;
  onDisconnected?: () => void;
  onReconnecting?: () => void;
  onReconnected?: () => void;
  onSearchTimeout?: () => void;
}

class SocketManagerClass implements SocketManager {
  socket: Socket | null = null;
  isConnected: boolean = false;
  private searchTimeout: NodeJS.Timeout | null = null;
  onMatched?: (data: { roomId: string; peerId: string; isInitiator: boolean }) => void;
  onWaiting?: () => void;
  onSignal?: (data: { signal: any; from: string }) => void;
  onCallEnded?: () => void;
  onPeerDisconnected?: () => void;
  onUserCount?: (count: number) => void;
  onAuthRequired?: (data: { message: string }) => void;
  onDisconnected?: () => void;
  onReconnecting?: () => void;
  onReconnected?: () => void;
  onSearchTimeout?: () => void;

  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already connected, just resolve
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // If socket exists but not connected, clean it up first
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.io.removeAllListeners();  // Clean up manager listeners too
        this.socket.disconnect();
        this.socket = null;
      }

      // Get userId - either passed in or from a stored session (for bypass mode)
      let authUserId = userId;
      if (!authUserId && typeof window !== 'undefined') {
        // For bypass mode, use sessionId as temporary userId
        const sessionId = localStorage.getItem('session_id');
        if (sessionId) {
          authUserId = sessionId;
        }
      }

      // Use production Socket.io URL or fallback to localhost for development
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

      this.socket = io(socketUrl, {
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,        // Wait 1 second before first reconnect
        reconnectionDelayMax: 5000,     // Max 5 seconds between reconnect attempts
        reconnectionAttempts: Infinity, // Keep trying forever
        timeout: 10000,
        transports: ['websocket'],      // Force WebSocket only (prevents polling upgrade cycles)
        auth: {
          userId: authUserId
        }
      });

      this.socket.on('connect', () => {
        console.log('🟢 CONNECTED - Socket ID:', this.socket?.id);
        console.log('🟢 Transport:', this.socket?.io?.engine?.transport?.name);
        this.isConnected = true;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔴 DISCONNECT EVENT FIRED');
        console.log('🔴 Reason:', reason);
        console.log('🔴 Time:', new Date().toISOString());
        this.isConnected = false;
        if (this.onDisconnected) {
          this.onDisconnected();
        }
        // Auto-reconnect unless manually disconnected
        if (reason !== 'io client disconnect') {
          if (this.onReconnecting) {
            this.onReconnecting();
          }
        }
      });

      this.socket.io.on('reconnect_attempt', (attemptNumber) => {
        console.log('🟡 RECONNECT ATTEMPT #' + attemptNumber);
        if (this.onReconnecting) {
          this.onReconnecting();
        }
      });

      this.socket.io.on('reconnect', (attemptNumber) => {
        console.log('🟢 RECONNECTED after ' + attemptNumber + ' attempts');
        this.isConnected = true;
        if (this.onReconnected) {
          this.onReconnected();
        }
      });

      this.socket.io.on('reconnect_error', (error) => {
        console.log('🔴 RECONNECT ERROR:', error.message);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect to signaling server');
        this.onDisconnected?.();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      // Handle matching events
      this.socket.on('matched', (data) => {
        console.log('Matched with peer:', data);
        // Clear search timeout when matched
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
        }
        this.onMatched?.(data);
      });

      this.socket.on('waiting', () => {
        console.log('Waiting for match...');
        this.onWaiting?.();

        // Start 30-second timeout for "no users available"
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
          console.log('Search timeout - no users found');
          this.onSearchTimeout?.();
        }, 30000); // 30 seconds
      });

      // Handle signaling
      this.socket.on('signal', (data) => {
        console.log('Received signal:', data);
        this.onSignal?.(data);
      });

      // Handle call events
      this.socket.on('call-ended', () => {
        console.log('Call ended by peer');
        this.onCallEnded?.();
      });

      this.socket.on('peer-disconnected', () => {
        console.log('Peer disconnected');
        this.onPeerDisconnected?.();
      });

      // Handle user count updates
      this.socket.on('user-count', (count: number) => {
        console.log('User count updated:', count);
        this.onUserCount?.(count);
      });

      // Handle auth required
      this.socket.on('auth-required', (data: { message: string }) => {
        console.log('Authentication required:', data.message);
        this.onAuthRequired?.(data);
      });
    });
  }

  joinQueue(): void {
    if (this.socket?.connected) {
      this.socket.emit('join-queue');
    }
  }

  leaveQueue(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-queue');
    }
    // Clear search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }

  startCall(filters?: { interests: string[]; preferredCountries: string[]; nonPreferredCountries: string[] }): void {
    if (this.socket?.connected) {
      this.socket.emit('join-queue', filters || {
        interests: [],
        preferredCountries: [],
        nonPreferredCountries: []
      });
    }
  }

  sendSignal(signal: any): void {
    if (this.socket?.connected) {
      this.socket.emit('signal', { signal });
    }
  }

  endCall(): void {
    if (this.socket?.connected) {
      this.socket.emit('end-call');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.io.removeAllListeners();  // Clean up manager listeners too
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    // Clear search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
}

// Export singleton instance
export const socketManager = new SocketManagerClass();