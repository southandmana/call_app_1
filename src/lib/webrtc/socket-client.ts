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

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // Get session ID from localStorage
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('session_id') : null;

      this.socket = io('http://localhost:3001', {
        forceNew: true,
        reconnection: true,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        auth: {
          sessionId: sessionId
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to signaling server');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from signaling server:', reason);
        this.isConnected = false;
        this.onDisconnected?.();

        // Auto-reconnect unless manually disconnected
        if (reason !== 'io client disconnect') {
          this.onReconnecting?.();
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected to signaling server after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.onReconnected?.();
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt', attemptNumber);
        this.onReconnecting?.();
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
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
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Export singleton instance
export const socketManager = new SocketManagerClass();