'use client';

import { useState, useEffect } from 'react';
import { webrtcManager, ConnectionState } from '@/lib/webrtc/manager';
import { socketManager, MatchingState } from '@/lib/webrtc/socket-client';

export default function TestPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [matchingState, setMatchingState] = useState<MatchingState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string>('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [pendingSignals, setPendingSignals] = useState<any[]>([]);

  useEffect(() => {
    // Connect to signaling server
    socketManager.connect()
      .then(() => {
        setSocketConnected(true);
        setError('');
      })
      .catch((err) => {
        setSocketConnected(false);
        setError('Failed to connect to signaling server: ' + err.message);
      });

    // Set up WebRTC event handlers
    webrtcManager.onStateChange = setConnectionState;
    webrtcManager.onError = (err) => {
      setError(err.message);
    };

    // Set up Socket event handlers
    socketManager.onMatched = async (data) => {
      try {
        setMatchingState('matched');
        await webrtcManager.initializePeer(data.isInitiator);

        // Process any pending signals
        pendingSignals.forEach(signal => {
          if (webrtcManager.peer) {
            webrtcManager.connectToPeer(signal);
          }
        });
        setPendingSignals([]);
      } catch (err) {
        setError('Failed to initialize peer: ' + (err as Error).message);
        setMatchingState('idle');
      }
    };

    socketManager.onWaiting = () => {
      setMatchingState('searching');
    };

    socketManager.onSignal = (data) => {
      if (webrtcManager.peer) {
        webrtcManager.connectToPeer(data.signal);
      } else {
        // Queue signal for when peer is ready
        setPendingSignals(prev => [...prev, data.signal]);
      }
    };

    socketManager.onCallEnded = () => {
      webrtcManager.endCall();
      setMatchingState('idle');
      setIsMuted(false);
      setPendingSignals([]);
    };

    socketManager.onPeerDisconnected = () => {
      webrtcManager.endCall();
      setMatchingState('idle');
      setIsMuted(false);
      setError('Peer disconnected');
      setPendingSignals([]);
    };

    return () => {
      socketManager.leaveQueue();
      webrtcManager.endCall();
      socketManager.disconnect();
    };
  }, []);

  const startCall = () => {
    try {
      setError('');
      socketManager.joinQueue();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cancelSearch = () => {
    socketManager.leaveQueue();
    setMatchingState('idle');
  };

  const endCall = () => {
    webrtcManager.endCall();
    setMatchingState('idle');
    setIsMuted(false);
    setError('');
    setPendingSignals([]);
  };

  const toggleMute = () => {
    const newMuteState = webrtcManager.toggleMute();
    setIsMuted(newMuteState);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">WebRTC Audio Test</h1>

        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              socketConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize font-medium">
              Server: {socketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionState === 'connected' ? 'bg-green-500' :
              connectionState === 'connecting' || connectionState === 'creating' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}></div>
            <span className="capitalize font-medium">Call: {connectionState}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              matchingState === 'matched' ? 'bg-green-500' :
              matchingState === 'searching' ? 'bg-yellow-500' :
              'bg-gray-500'
            }`}></div>
            <span className="capitalize font-medium">
              {matchingState === 'searching' ? 'Searching for peer...' :
               matchingState === 'matched' ? 'Matched!' : 'Ready to call'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Call Action */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Start a Call</h2>
          {matchingState === 'idle' && (
            <button
              onClick={startCall}
              disabled={!socketConnected}
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              {socketConnected ? 'Find Someone to Call' : 'Connecting to Server...'}
            </button>
          )}

          {matchingState === 'searching' && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-lg font-medium">Searching for someone to call...</span>
              </div>
              <button
                onClick={cancelSearch}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel Search
              </button>
            </div>
          )}

          {matchingState === 'matched' && connectionState !== 'connected' && (
            <div className="text-center">
              <div className="text-lg font-medium text-green-600 mb-2">
                Found someone! Connecting...
              </div>
              <div className="animate-pulse text-sm text-gray-600">
                Allow microphone access when prompted
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        {connectionState !== 'idle' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Call Controls</h2>
            <div className="flex space-x-4">
              <button
                onClick={toggleMute}
                className={`${
                  isMuted ? 'bg-red-500 hover:bg-red-700' : 'bg-gray-500 hover:bg-gray-700'
                } text-white font-bold py-2 px-4 rounded`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
              >
                Hang Up
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mt-6">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Click "Find Someone to Call"</li>
            <li>Open this page in another tab</li>
            <li>Click "Find Someone to Call" in the second tab</li>
            <li>You'll be automatically matched and connected!</li>
            <li>Allow microphone access when prompted</li>
            <li>You should now be able to talk between tabs!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}