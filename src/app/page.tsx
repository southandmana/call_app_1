'use client';

import { useState, useEffect, useRef } from 'react';
import { WebRTCManager } from '@/lib/webrtc/manager';
import { socketManager } from '@/lib/webrtc/socket-client';
import FiltersMenu, { UserFilters } from '@/components/FiltersMenu';
import PhoneVerification from '@/components/PhoneVerification';
import ErrorModal from '@/components/ErrorModal';
import ErrorToast from '@/components/ErrorToast';
import ErrorBanner from '@/components/ErrorBanner';
import ThemeToggle from '@/components/ThemeToggle';
import ControlBar from '@/components/ControlBar';
import AccountMenu from '@/components/AccountMenu';
import VoiceActivityIndicator from '@/components/VoiceActivityIndicator';
import axios from 'axios';

type CallState = 'idle' | 'searching' | 'connected' | 'no-users';

export default function Home() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [autoCallEnabled, setAutoCallEnabled] = useState(false);
  const [webrtcManager, setWebrtcManager] = useState<WebRTCManager | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userFilters, setUserFilters] = useState<UserFilters>({
    interests: [],
    preferredCountries: [],
    nonPreferredCountries: []
  });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Error states
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'mic-permission' | 'connection-failed' | 'general';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'general',
  });
  const [toastMessage, setToastMessage] = useState<{
    isVisible: boolean;
    message: string;
    type: 'error' | 'info' | 'success';
  }>({
    isVisible: false,
    message: '',
    type: 'info',
  });
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showDisconnectedMessage, setShowDisconnectedMessage] = useState(false);

  // Use refs to access current values in callbacks
  const autoCallEnabledRef = useRef(autoCallEnabled);
  const userFiltersRef = useRef(userFilters);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    autoCallEnabledRef.current = autoCallEnabled;
  }, [autoCallEnabled]);

  useEffect(() => {
    userFiltersRef.current = userFilters;
  }, [userFilters]);

  // Check phone verification on mount
  useEffect(() => {
    const checkVerification = async () => {
      // Feature flag: bypass phone verification for testing
      const bypassVerification = process.env.NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION === 'true';

      if (bypassVerification) {
        console.log('🚧 Phone verification bypassed (feature flag enabled)');

        // Auto-create a test session_id for bypassed verification
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = `test-session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          localStorage.setItem('session_id', sessionId);
          console.log('🚧 Created test session_id:', sessionId);
        }

        setIsVerified(true);
        setShowVerification(false);
        return;
      }

      const sessionId = localStorage.getItem('session_id');

      if (!sessionId) {
        setShowVerification(true);
        return;
      }

      // Verify session is still valid
      try {
        const response = await axios.post('/api/session/status', { sessionId });
        if (response.data.verified) {
          setIsVerified(true);
          setShowVerification(false);
        } else {
          setShowVerification(true);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        setShowVerification(true);
      }
    };

    checkVerification();
  }, []);

  const handleVerificationSuccess = (_sessionId: string) => {
    setIsVerified(true);
    setShowVerification(false);
  };

  useEffect(() => {
    // Reuse existing manager if available (prevents duplication on HMR)
    if (!webrtcManagerRef.current) {
      webrtcManagerRef.current = new WebRTCManager();
    }
    const manager = webrtcManagerRef.current;
    setWebrtcManager(manager);

    manager.on('callStarted', () => {
      setCallState('connected');
      setLocalStream(manager.getLocalStream());
    });

    manager.on('error', (data: { type: string; error: Error }) => {
      console.error('WebRTC error:', data);
      if (data.type === 'mic-permission') {
        setErrorModal({
          isOpen: true,
          title: 'Microphone Access Required',
          message: 'Voice calling requires access to your microphone. Please enable microphone permissions and reload the page.',
          type: 'mic-permission',
        });
        setCallState('idle');
      } else if (data.type === 'connection-failed') {
        setErrorModal({
          isOpen: true,
          title: 'Connection Failed',
          message: 'Unable to establish a connection with your partner. This may be due to network restrictions or firewall settings.',
          type: 'connection-failed',
        });
        setCallState('idle');
      }
    });

    manager.on('connectionDropped', () => {
      // Show disconnect message in subtitle instead of toast
      setShowDisconnectedMessage(true);
      setCallState('idle');
    });

    manager.on('callEnded', () => {
      setLocalStream(null);
      // Auto-call logic: if enabled, always restart (regardless of who ended it)
      if (autoCallEnabledRef.current) {
        console.log('Auto-call enabled, restarting search in 2 seconds...');
        setCallState('searching');

        setTimeout(async () => {
          try {
            await manager.startCall(userFiltersRef.current);
          } catch (error) {
            console.error('Auto-call failed:', error);
            setCallState('idle');
          }
        }, 2000);
      } else {
        setCallState('idle');
      }
    });

    // Listen for connection state changes to handle searching state
    manager.onStateChange = (state) => {
      if (state === 'connecting') {
        setCallState('searching');
        // Reset disconnect message when starting to search (prevents flicker)
        setShowDisconnectedMessage(false);
      } else if (state === 'connected') {
        setCallState('connected');
      } else if (state === 'idle' || state === 'disconnected') {
        setCallState('idle');
      }
    };

    return () => {
      manager.disconnect();
      webrtcManagerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect socket and listen for user count updates
  useEffect(() => {
    const connectSocket = async () => {
      try {
        // Skip if already connected (prevents duplicate connections in Strict Mode)
        if (socketManager.isConnected) {
          console.log('Socket already connected, skipping duplicate connect');
          return;
        }

        await socketManager.connect();

        socketManager.onUserCount = (count: number) => {
          setOnlineUsers(count);
        };

        socketManager.onAuthRequired = (data: { message: string }) => {
          console.log('Auth required:', data.message);
          setShowVerification(true);
          setIsVerified(false);
        };

        socketManager.onDisconnected = () => {
          setIsDisconnected(true);
          setIsReconnecting(false);
        };

        socketManager.onReconnecting = () => {
          setIsReconnecting(true);
          setIsDisconnected(false);
        };

        socketManager.onReconnected = () => {
          setIsDisconnected(false);
          setIsReconnecting(false);
          setToastMessage({
            isVisible: true,
            message: 'Reconnected to server!',
            type: 'success',
          });
        };

        socketManager.onSearchTimeout = () => {
          console.log('Search timeout - no users available');
          setCallState('no-users');
        };
      } catch (error) {
        console.error('Failed to connect socket for user count:', error);
      }
    };

    connectSocket();

    return () => {
      socketManager.onUserCount = undefined;
      socketManager.onAuthRequired = undefined;
      socketManager.onDisconnected = undefined;
      socketManager.onReconnecting = undefined;
      socketManager.onReconnected = undefined;
      socketManager.onSearchTimeout = undefined;
      // Disconnect socket to prevent connection leaks on HMR
      socketManager.disconnect();
    };
  }, []);

  const handleCallClick = async () => {
    if (!webrtcManager) return;

    if (callState === 'idle') {
      try {
        // Don't reset showDisconnectedMessage here - it will be reset when state changes to 'searching'
        // This prevents flicker of the default idle message before 'searching' state is set
        await webrtcManager.startCall(userFilters);
        // State will be updated by onStateChange callback
      } catch (error) {
        console.error('Failed to start call:', error);
        setCallState('idle');
      }
    } else if (callState === 'searching') {
      // Cancel the search
      webrtcManager.endCall(true);
      // State will be updated by onStateChange callback
    } else if (callState === 'connected') {
      webrtcManager.endCall();
      // State will be updated by onStateChange callback
    }
  };

  const handleApplyFilters = (filters: UserFilters) => {
    setUserFilters(filters);
    console.log('Filters applied:', filters);
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

  const handleSkip = () => {
    // Skip to next caller (ends current call)
    if (webrtcManager) {
      webrtcManager.endCall();
    }
    console.log('Skip to next caller');
  };

  const handleAddFriend = () => {
    // TODO: Implement add friend functionality
    console.log('Add friend');
  };

  const handleBlock = () => {
    // TODO: Implement block functionality
    console.log('Block user');
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !userFilters.interests.includes(interest)) {
      setUserFilters({
        ...userFilters,
        interests: [...userFilters.interests, interest]
      });
    }
  };

  const getCallButtonText = () => {
    if (callState === 'searching' && autoCallEnabled) {
      return 'Searching for next caller...';
    }
    switch (callState) {
      case 'searching': return 'Searching...';
      case 'connected': return 'Hang Up';
      case 'no-users': return 'No Users Available';
      default: return 'Call';
    }
  };

  const getStatusTitle = () => {
    // Show sad message if user was hung up on
    if (showDisconnectedMessage && callState === 'idle') {
      return 'Oh no :(';
    }

    switch (callState) {
      case 'searching': return 'Finding you a match';
      case 'connected': return 'Connected';
      case 'no-users': return 'No one available';
      default: return 'Welcome';
    }
  };

  const getStatusSubtitle = () => {
    // Show disconnect message if user was hung up on
    if (showDisconnectedMessage && callState === 'idle') {
      return 'Call disconnected. Your partner may have left or lost connection.';
    }

    switch (callState) {
      case 'searching': return 'Looking for someone interesting...';
      case 'connected': return 'You\'re talking with a stranger';
      case 'no-users': return 'Try again in a moment or adjust your filters';
      default: return 'Press the button below to start a voice call ';
    }
  };

  const handleCancelSearch = () => {
    if (webrtcManager) {
      webrtcManager.endCall();
    }
    setCallState('idle');
  };

  const getCallButtonClass = () => {
    const baseClass = "rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-none cursor-pointer";
    const sizeClass = "w-[120px] h-[120px]"; // 120px as per HTML design

    if (callState === 'connected') {
      return `${baseClass} ${sizeClass} call-button-connected`;
    }

    if (callState === 'searching') {
      return `${baseClass} ${sizeClass} call-button-searching`;
    }

    if (callState === 'no-users') {
      return `${baseClass} ${sizeClass} call-button-disabled`;
    }

    return `${baseClass} ${sizeClass} call-button-idle`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)', padding: '0 24px 24px 24px' }}>
      {/* Error/Connection Banner */}
      {isReconnecting && (
        <ErrorBanner
          isVisible={true}
          message="Connection lost. Reconnecting..."
          type="info"
        />
      )}
      {isDisconnected && !isReconnecting && (
        <ErrorBanner
          isVisible={true}
          message="Disconnected from server. Please refresh the page."
          type="error"
        />
      )}

      {/* Header */}
      <header className="flex justify-between items-center" style={{
        background: 'var(--bg-primary)',
        padding: 'var(--space-lg) var(--space-xl)',
        gap: 'var(--space-xl)'
      }}>
        <div className="flex items-center">
          {/* Icon Logo */}
          <img
            src="/icon-logo.svg"
            alt="Logo"
            className="logo"
            style={{
              height: '32px',
              width: 'auto'
            }}
          />
        </div>

        <div className="flex items-center" style={{ gap: 'var(--space-lg)' }}>
          {/* Online Users Count */}
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'inline-block'
            }}></span>
            {onlineUsers} people online
          </div>

          {/* Vertical Divider */}
          <div style={{
            width: '1px',
            height: '24px',
            background: 'var(--border-primary)',
            opacity: 0.5
          }}></div>

          {/* Account Button */}
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'var(--text-secondary)'
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center" style={{
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        padding: 'var(--space-3xl)',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div className="flex flex-col items-center max-w-2xl w-full" style={{ gap: 'var(--space-2xl)' }}>
          {/* Status Message */}
          <div className="text-center" style={{ maxWidth: '600px', minHeight: '180px' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              minHeight: '105px',
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {callState === 'idle' && !showDisconnectedMessage ? (
                <img
                  src="/logo.svg"
                  alt="CQPDUK"
                  className="logo"
                  style={{
                    height: '60px',
                    width: 'auto'
                  }}
                />
              ) : (
                getStatusTitle()
              )}
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: 500,
              color: showDisconnectedMessage && callState === 'idle' ? '#ef4444' : 'var(--text-tertiary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: '54px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getStatusSubtitle()}
            </p>

            {/* Interest Tags */}
            {userFilters.interests.length > 0 && (
              <div style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                height: '48px',
                marginTop: 'var(--space-lg)'
              }}>
                {userFilters.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="interest-tag"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-secondary)',
                      padding: '8px 16px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      lineHeight: 1.4,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {interest}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call Button */}
          <div className="flex flex-col items-center">
            <VoiceActivityIndicator audioStream={localStream}>
              <button
                onClick={handleCallClick}
                className={getCallButtonClass()}
                disabled={callState === 'no-users'}
                style={{
                  position: 'relative',
                  ...(callState === 'searching' && {
                    background: 'transparent',
                    border: '4px solid rgba(139, 92, 246, 0.2)',
                    boxShadow: 'none',
                    cursor: 'pointer'
                  })
                }}
              >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {callState === 'searching' ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px' }}>
                    <rect x="6" y="6" width="12" height="12" fill="#8b5cf6" rx="2"/>
                  </svg>
                ) : (
                  <svg
                    style={{
                      width: '36px',
                      height: '36px',
                      transform: callState === 'connected' ? 'rotate(135deg)' : 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                )}
              </span>

              {/* Spinning ring when searching */}
              {callState === 'searching' && (
                <span style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: '4px solid transparent',
                  borderTopColor: '#8b5cf6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  pointerEvents: 'none'
                }} />
              )}
            </button>
            </VoiceActivityIndicator>

            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          {/* Control Bar */}
          <ControlBar
            callState={callState}
            isMuted={isMuted}
            onMute={handleMute}
            onSkip={handleSkip}
            onAddFriend={handleAddFriend}
            onBlock={handleBlock}
            onReport={handleReport}
            userFilters={userFilters}
            onAddInterest={handleAddInterest}
            onFiltersChange={setUserFilters}
          />

          {/* Old control buttons removed - now in ControlBar */}
          <div className="flex flex-col items-center" style={{ gap: 'var(--space-xl)', display: 'none' }}>
            {/* Mute Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleMute}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isMuted ? 'var(--error)' : 'var(--bg-tertiary)',
                  color: isMuted ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${isMuted ? 'var(--error)' : 'var(--border-primary)'}`
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {isMuted ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.146 6.146a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L13.293 8.5H12a.5.5 0 010-1h1.293l-1.147-1.146a.5.5 0 010-.708z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              <span className="text-sm font-medium mt-2" style={{ color: 'var(--text-tertiary)' }}>Mute</span>
            </div>

            {/* Report Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleReport}
                disabled={callState !== 'connected'}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: callState === 'connected' ? 'var(--warning)' : 'var(--bg-tertiary)',
                  color: callState === 'connected' ? 'white' : 'var(--text-muted)',
                  border: `1px solid ${callState === 'connected' ? 'var(--warning)' : 'var(--border-primary)'}`,
                  opacity: callState === 'connected' ? 1 : 0.5,
                  cursor: callState === 'connected' ? 'pointer' : 'not-allowed'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-sm font-medium mt-2" style={{ color: 'var(--text-tertiary)' }}>Report</span>
            </div>
          </div>

        </div>
      </main>

      {/* Filters Menu */}
      <FiltersMenu
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Account Menu */}
      <AccountMenu
        isOpen={isAccountMenuOpen}
        onClose={() => setIsAccountMenuOpen(false)}
        autoCallEnabled={autoCallEnabled}
        onAutoCallToggle={() => setAutoCallEnabled(!autoCallEnabled)}
        onSignOut={() => {
          localStorage.removeItem('session_id');
          setIsVerified(false);
          setShowVerification(true);
        }}
      />

      {/* Phone Verification Modal */}
      {showVerification && (
        <PhoneVerification onVerificationSuccess={handleVerificationSuccess} />
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        type={errorModal.type}
        onRetry={errorModal.type === 'connection-failed' ? () => {
          setErrorModal({ ...errorModal, isOpen: false });
          handleCallClick();
        } : undefined}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />

      {/* Toast Notifications */}
      <ErrorToast
        isVisible={toastMessage.isVisible}
        message={toastMessage.message}
        type={toastMessage.type}
        onClose={() => setToastMessage({ ...toastMessage, isVisible: false })}
      />
    </div>
  );
}