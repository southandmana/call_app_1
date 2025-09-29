'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface PhoneVerificationProps {
  onVerificationSuccess: (sessionId: string) => void;
}

export default function PhoneVerification({ onVerificationSuccess }: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Countdown timer for resend button
  useEffect(() => {
    if (step === 'code' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handleSendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/send-code', {
        phoneNumber: phoneNumber,
      });

      if (response.data.success) {
        setStep('code');
        setResendTimer(60);
        setCanResend(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-code', {
        phoneNumber: phoneNumber,
        code: code,
      });

      if (response.data.success) {
        // Store session ID in localStorage
        localStorage.setItem('session_id', response.data.sessionId);
        onVerificationSuccess(response.data.sessionId);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCode('');
    setError('');
    setCanResend(false);
    setResendTimer(60);
    await handleSendCode();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {step === 'phone' ? 'Verify Your Phone' : 'Enter Code'}
        </h2>

        <p className="text-gray-600 mb-6">
          {step === 'phone'
            ? 'Please enter your phone number to continue'
            : `We sent a 6-digit code to ${phoneNumber}`}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <div>
            <input
              type="tel"
              placeholder="+64 21 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none mb-4"
              disabled={loading}
            />
            <button
              onClick={handleSendCode}
              disabled={loading || !phoneNumber}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none mb-4 text-center text-2xl tracking-widest"
              disabled={loading}
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-green-600 hover:text-green-700 font-medium"
                  disabled={loading}
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend code in {resendTimer}s
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setStep('phone');
                setCode('');
                setError('');
              }}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}