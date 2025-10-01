'use client';

import { useState, useEffect, useRef } from 'react';
import { UserFilters } from './FiltersMenu';

type CallState = 'idle' | 'searching' | 'connected' | 'no-users';

interface ControlBarProps {
  callState: CallState;
  isMuted: boolean;
  onMute: () => void;
  onSkip: () => void;
  onAddFriend: () => void;
  onBlock: () => void;
  onReport: () => void;
  userFilters: UserFilters;
  onAddInterest: (interest: string) => void;
}

export default function ControlBar({
  callState,
  isMuted,
  onMute,
  onSkip,
  onAddFriend,
  onBlock,
  onReport,
  onAddInterest,
}: ControlBarProps) {
  const isIdle = callState === 'idle';
  const isConnected = callState === 'connected';
  const shouldShow = isIdle || isConnected;

  const [placeholder, setPlaceholder] = useState('Add interests (optional)');
  const [charCount, setCharCount] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isFocusedState, setIsFocusedState] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blinking cursor - runs continuously
  useEffect(() => {
    if (!isIdle) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isIdle]);

  // Animated typewriter placeholder
  useEffect(() => {
    if (!isIdle) return;

    const staticPrefix = 'Try typing ';
    const messages = [
      'music, gaming, coffee...',
      'travel, movies, sports...',
      'cooking, reading, art...',
      'photography, hiking...',
      'tech, fitness, fashion...'
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isFocused = false;
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      if (isFocused) {
        timeoutId = setTimeout(animate, 100);
        return;
      }

      const currentMessage = messages[messageIndex];

      if (isDeleting) {
        charIndex--;
        setCurrentText(staticPrefix + currentMessage.substring(0, charIndex));

        if (charIndex === 0) {
          isDeleting = false;
          messageIndex = (messageIndex + 1) % messages.length;
          timeoutId = setTimeout(animate, 500);
        } else {
          timeoutId = setTimeout(animate, 30);
        }
      } else {
        charIndex++;
        setCurrentText(staticPrefix + currentMessage.substring(0, charIndex));

        if (charIndex === currentMessage.length) {
          isDeleting = true;
          timeoutId = setTimeout(animate, 2000);
        } else {
          timeoutId = setTimeout(animate, 80);
        }
      }
    };

    const handleFocus = () => {
      isFocused = true;
      setIsFocusedState(true);
      setPlaceholder('Add interests (optional)');
    };

    const handleBlur = () => {
      isFocused = false;
      setIsFocusedState(false);
      charIndex = 0;
      isDeleting = false;
      messageIndex = 0;
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    timeoutId = setTimeout(animate, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [isIdle]);

  // Update placeholder with cursor (only when not focused)
  useEffect(() => {
    if (isIdle && currentText && !isFocusedState) {
      const cursor = showCursor ? '|' : ' ';
      setPlaceholder(currentText + cursor);
    }
  }, [currentText, showCursor, isIdle, isFocusedState]);

  const handleInterestKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      onAddInterest(e.currentTarget.value.trim());
      e.currentTarget.value = '';
      setCharCount(0);
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleInterestBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') {
      e.target.value = '';
      setCharCount(0);
    }
  };

  if (!shouldShow) return null;

  return (
    <div style={{
      position: 'relative',
      height: '48px',
      width: '100%'
    }}>
      <div className={`controls ${isIdle ? 'idle-mode' : 'connected-mode'} show`} style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 16px',
        border: '1px solid var(--border-primary)',
        borderRadius: '32px',
        background: 'var(--bg-secondary)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
        width: isIdle ? '90%' : 'auto',
        maxWidth: isIdle ? '600px' : 'calc(100% - 80px)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Idle Mode: Interest Input */}
        {isIdle && (
          <div
            className="interest-input-container"
            style={{
              flex: 1,
              maxWidth: '420px',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              maxLength={20}
              onKeyPress={handleInterestKeyPress}
              onChange={handleInterestChange}
              onBlur={handleInterestBlur}
              style={{
                width: '100%',
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'inherit',
                outline: 'none',
                textAlign: 'left',
                lineHeight: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="interest-input"
            />
            <span
              className={`interest-counter ${charCount >= 20 ? 'error' : charCount >= 18 ? 'warning' : ''}`}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            >
              {charCount}/20
            </span>
          </div>
        )}

        {/* Connected Mode: Control Buttons */}
        {isConnected && (
          <>
            {/* Mute Button */}
            <button
              onClick={onMute}
              className={`control-item mute-button ${isMuted ? 'muted' : ''}`}
              style={{
                width: '48px',
                height: '48px',
                padding: 0,
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                borderColor: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
                color: isMuted ? '#ef4444' : '#b0b8c5',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>

            {/* Skip Button */}
            <button
              onClick={onSkip}
              className="control-item skip-button"
              style={{
                width: '48px',
                height: '48px',
                padding: 0,
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: '#b0b8c5',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>

            {/* Add Friend Button */}
            <button
              onClick={onAddFriend}
              className="control-item add-friend-button"
              style={{
                height: '48px',
                padding: '0 16px',
                minWidth: '48px',
                borderRadius: '24px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c4b5fd',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="button-text">Add Friend</span>
            </button>

            {/* Block Button */}
            <button
              onClick={onBlock}
              className="control-item block-button"
              style={{
                height: '48px',
                padding: '0 16px',
                minWidth: '48px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: '#b0b8c5',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="button-text">Block</span>
            </button>

            {/* Report Button */}
            <button
              onClick={onReport}
              className="control-item report-button-control"
              style={{
                width: '48px',
                height: '48px',
                padding: 0,
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: '#b0b8c5',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
