'use client';

import { useState, useEffect, useRef } from 'react';
import { playSound } from '@/lib/audio';

type CallState = 'idle' | 'searching' | 'connected' | 'no-users';

interface ControlBarProps {
  callState: CallState;
  isMuted: boolean;
  onMute: () => void;
  onSkip: () => void;
  onAddFriend: () => void;
  onBlock: () => void;
  onReport: () => void;
}

export default function ControlBar({
  callState,
  isMuted,
  onMute,
  onSkip,
  onAddFriend,
  onBlock,
  onReport,
}: ControlBarProps) {
  const isIdle = callState === 'idle';
  const isConnected = callState === 'connected';
  const isSearching = callState === 'searching';
  const shouldShow = isIdle || isConnected || isSearching;

  return (
    <div style={{
      position: 'relative',
      height: '72px',
      width: '100%',
      zIndex: 1
    }}>
      {shouldShow && (
        <div className={`controls ${isIdle ? 'idle-mode' : isSearching ? 'searching-mode' : 'connected-mode'} show`} style={{
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        border: 'none',
        borderRadius: '0',
        background: 'transparent',
        boxShadow: 'none',
        width: '336px',
        minHeight: '72px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Button Bar Container */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          width: '100%',
          minHeight: '72px',
          flexShrink: 0
        }}>
        {/* Searching Mode: Loading Dots */}
        {isSearching && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6',
              animation: 'dot-pulse 1.4s infinite ease-in-out both',
              animationDelay: '-0.32s'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6',
              animation: 'dot-pulse 1.4s infinite ease-in-out both',
              animationDelay: '-0.16s'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6',
              animation: 'dot-pulse 1.4s infinite ease-in-out both'
            }} />
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

            {/* Add Friend Button */}
            <button
              onClick={onAddFriend}
              className="control-item add-friend-button"
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
              title="Add Friend"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
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
      )}
    </div>
  );
}

// Add keyframes for dot pulse animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dot-pulse {
      0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}
