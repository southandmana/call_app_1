import Peer from 'simple-peer';
import { socketManager } from './socket-client';

export type ConnectionState = 'idle' | 'creating' | 'connecting' | 'connected' | 'disconnected';

export interface WebRTCManager {
  peer: Peer.Instance | null;
  localStream: MediaStream | null;
  connectionState: ConnectionState;
  isMuted: boolean;
  onStateChange?: (state: ConnectionState) => void;
  onSignalData?: (data: any) => void;
  onError?: (error: Error) => void;
}

class WebRTCManagerClass implements WebRTCManager {
  peer: Peer.Instance | null = null;
  localStream: MediaStream | null = null;
  remoteAudio: HTMLAudioElement | null = null;
  connectionState: ConnectionState = 'idle';
  isMuted: boolean = false;
  onStateChange?: (state: ConnectionState) => void;
  onSignalData?: (data: any) => void;
  onError?: (error: Error) => void;

  private setState(newState: ConnectionState) {
    this.connectionState = newState;
    this.onStateChange?.(newState);
  }

  async initializePeer(isInitiator: boolean = false): Promise<void> {
    try {
      this.setState('creating');

      // Get user media (audio only)
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: false
      });

      // Create reusable audio element for remote audio
      if (!this.remoteAudio) {
        this.remoteAudio = new Audio();
        this.remoteAudio.autoplay = true;
        this.remoteAudio.volume = 1.0;
      }

      // Create peer connection
      this.peer = new Peer({
        initiator: isInitiator,
        stream: this.localStream,
        trickle: false,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      // Handle signaling data
      this.peer.on('signal', (data) => {
        // Send signal through WebSocket instead of callback
        socketManager.sendSignal(data);
        this.onSignalData?.(data);
      });

      // Handle connection
      this.peer.on('connect', () => {
        this.setState('connected');
      });

      // Handle incoming stream
      this.peer.on('stream', (remoteStream) => {
        // Use the reusable audio element for remote audio
        if (this.remoteAudio) {
          this.remoteAudio.srcObject = remoteStream;
          this.remoteAudio.play().catch(console.error);
        }
      });

      // Handle errors
      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        this.onError?.(err);
        this.setState('disconnected');
      });

      // Handle close
      this.peer.on('close', () => {
        this.setState('disconnected');
      });

    } catch (error) {
      console.error('Failed to initialize peer:', error);
      this.onError?.(error as Error);
      this.setState('disconnected');
    }
  }

  async connectToPeer(signalData: any): Promise<void> {
    if (!this.peer) {
      throw new Error('Peer not initialized');
    }

    try {
      this.setState('connecting');
      this.peer.signal(signalData);
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      this.onError?.(error as Error);
      this.setState('disconnected');
    }
  }

  endCall(): void {
    // Notify signaling server
    socketManager.endCall();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Clean up remote audio element
    if (this.remoteAudio) {
      this.remoteAudio.pause();
      this.remoteAudio.srcObject = null;
      this.remoteAudio = null;
    }

    this.isMuted = false;
    this.setState('idle');
  }

  toggleMute(): boolean {
    if (!this.localStream) {
      return false;
    }

    this.isMuted = !this.isMuted;

    this.localStream.getAudioTracks().forEach(track => {
      track.enabled = !this.isMuted;
    });

    return this.isMuted;
  }

  isConnected(): boolean {
    return this.connectionState === 'connected';
  }
}

// Export singleton instance
export const webrtcManager = new WebRTCManagerClass();