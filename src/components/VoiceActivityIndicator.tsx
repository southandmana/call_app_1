'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

interface VoiceActivityIndicatorProps {
  audioStream: MediaStream | null;
  children: ReactNode;
}

export default function VoiceActivityIndicator({ audioStream, children }: VoiceActivityIndicatorProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioStream) {
      // Cleanup when stream is null
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      analyserRef.current = null;
      setIsSpeaking(false);
      return;
    }

    try {
      // Create audio context and analyser
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect stream to analyser
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      let lastUpdate = 0;
      const FRAME_INTERVAL = 50; // 20fps throttling

      const detectVoiceActivity = (timestamp: number) => {
        if (!analyserRef.current) return;

        // Throttle to 20fps for performance
        if (timestamp - lastUpdate < FRAME_INTERVAL) {
          animationFrameRef.current = requestAnimationFrame(detectVoiceActivity);
          return;
        }
        lastUpdate = timestamp;

        // Analyze frequency data
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        // Threshold for speaking detection
        const SPEAKING_THRESHOLD = 30;
        setIsSpeaking(average > SPEAKING_THRESHOLD);

        animationFrameRef.current = requestAnimationFrame(detectVoiceActivity);
      };

      animationFrameRef.current = requestAnimationFrame(detectVoiceActivity);
    } catch (error) {
      console.error('Failed to initialize voice activity detection:', error);
    }

    return () => {
      // Cleanup on unmount or stream change
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      analyserRef.current = null;
      setIsSpeaking(false);
    };
  }, [audioStream]);

  return (
    <div className={`voice-activity-wrapper ${isSpeaking ? 'speaking' : ''}`}>
      {children}
    </div>
  );
}
