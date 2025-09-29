'use client';

import { useState, useEffect } from 'react';
import { WebRTCManager } from '@/lib/webrtc/manager';
import FiltersMenu from '@/components/FiltersMenu';

type CallState = 'idle' | 'searching' | 'connected';

export default function Home() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [autoCallEnabled, setAutoCallEnabled] = useState(false);
  const [webrtcManager, setWebrtcManager] = useState<WebRTCManager | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const manager = new WebRTCManager();
    setWebrtcManager(manager);

    manager.on('callStarted', () => {
      setCallState('connected');
    });

    manager.on('callEnded', () => {
      setCallState('idle');
    });

    // Listen for connection state changes to handle searching state
    manager.onStateChange = (state) => {
      if (state === 'connecting') {
        setCallState('searching');
      } else if (state === 'connected') {
        setCallState('connected');
      } else if (state === 'idle' || state === 'disconnected') {
        setCallState('idle');
      }
    };

    return () => {
      manager.disconnect();
    };
  }, []);

  const handleCallClick = async () => {
    if (!webrtcManager) return;

    if (callState === 'idle') {
      try {
        await webrtcManager.startCall();
        // State will be updated by onStateChange callback
      } catch (error) {
        console.error('Failed to start call:', error);
        setCallState('idle');
      }
    } else if (callState === 'connected') {
      webrtcManager.endCall();
      // State will be updated by onStateChange callback
    }
  };

  const handleMute = () => {
    if (webrtcManager) {
      webrtcManager.toggleMute();
      setIsMuted(!isMuted);
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report user');
  };

  const getCallButtonText = () => {
    switch (callState) {
      case 'searching': return 'Searching...';
      case 'connected': return 'Hang Up';
      default: return 'Call';
    }
  };

  const getCallButtonClass = () => {
    const baseClass = "w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-semibold transition-all duration-300";

    if (callState === 'connected') {
      return `${baseClass} bg-red-500 hover:bg-red-600`;
    }

    if (callState === 'searching') {
      return `${baseClass} bg-green-500 animate-pulse`;
    }

    return `${baseClass} bg-green-500 hover:bg-green-600 hover:scale-105 animate-[radiating_2s_ease-in-out_infinite]`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">0</span>
          </div>
        </div>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isFiltersOpen
              ? 'text-green-600 bg-green-50'
              : 'text-gray-700 hover:text-gray-900'
          } px-3 py-2 rounded-lg`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-8 max-w-xs">
          {/* Logo */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            AirTalk
          </div>

          {/* Call Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleCallClick}
              className={getCallButtonClass()}
              disabled={callState === 'searching'}
            >
              <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <span className="text-sm font-medium mt-2 text-gray-700">{getCallButtonText()}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col items-center space-y-6">
            {/* Mute Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleMute}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isMuted
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {isMuted ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.146 6.146a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L13.293 8.5H12a.5.5 0 010-1h1.293l-1.147-1.146a.5.5 0 010-.708z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              <span className="text-sm font-medium mt-2 text-gray-700">Mute</span>
            </div>

            {/* Report Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleReport}
                disabled={callState !== 'connected'}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  callState === 'connected'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-sm font-medium mt-2 text-gray-700">Report</span>
            </div>
          </div>

          {/* Auto Call Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoCall"
              checked={autoCallEnabled}
              onChange={(e) => setAutoCallEnabled(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="autoCall" className="text-sm text-gray-700">
              Enable auto call
            </label>
          </div>

          {/* Call History Button */}
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Call History
          </button>

          {/* Instruction Text */}
          <p className="text-sm text-gray-600 text-center max-w-xs">
            Tap the <span className="text-green-600 font-medium">call button</span> to call a new stranger
          </p>
        </div>
      </main>

      {/* Bottom Ad Placeholder */}
      <div className="bg-gray-200 h-20 m-4 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        Advertisement Placeholder
      </div>

      {/* Filters Menu */}
      <FiltersMenu
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </div>
  );
}