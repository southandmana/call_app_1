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
}

class SocketManagerClass implements SocketManager {
  socket: Socket | null = null;
  isConnected: boolean = false;
  onMatched?: (data: { roomId: string; peerId: string; isInitiator: boolean }) => void;
  onWaiting?: () => void;
  onSignal?: (data: { signal: any; from: string }) => void;
  onCallEnded?: () => void;
  onPeerDisconnected?: () => void;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io('http://localhost:3001', {
        forceNew: true,
        reconnection: true,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to signaling server');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from signaling server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      // Handle matching events
      this.socket.on('matched', (data) => {
        console.log('Matched with peer:', data);
        this.onMatched?.(data);
      });

      this.socket.on('waiting', () => {
        console.log('Waiting for match...');
        this.onWaiting?.();
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