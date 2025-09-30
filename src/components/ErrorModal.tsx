'use client';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'mic-permission' | 'connection-failed' | 'general';
  onRetry?: () => void;
  onClose: () => void;
}

export default function ErrorModal({
  isOpen,
  title,
  message,
  type,
  onRetry,
  onClose,
}: ErrorModalProps) {
  if (!isOpen) return null;

  const getMicPermissionInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('chrome')) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Click the camera icon in the address bar (or site settings)</li>
          <li>Change "Microphone" from "Block" to "Allow"</li>
          <li>Reload this page</li>
        </ol>
      );
    } else if (userAgent.includes('firefox')) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Click the microphone icon in the address bar</li>
          <li>Select "Allow" for microphone access</li>
          <li>Reload this page</li>
        </ol>
      );
    } else if (userAgent.includes('safari')) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Go to Safari → Preferences → Websites → Microphone</li>
          <li>Change this website to "Allow"</li>
          <li>Reload this page</li>
        </ol>
      );
    }

    return (
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>Check your browser settings for microphone permissions</li>
        <li>Allow this website to access your microphone</li>
        <li>Reload this page</li>
      </ol>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2 text-gray-900">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-4">{message}</p>

        {/* Microphone permission instructions */}
        {type === 'mic-permission' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-sm text-blue-900 mb-2">
              How to enable microphone:
            </p>
            {getMicPermissionInstructions()}
          </div>
        )}

        {/* Connection failed help */}
        {type === 'connection-failed' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-sm text-blue-900 mb-2">
              Possible causes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Firewall or antivirus blocking connections</li>
              <li>Corporate network restrictions</li>
              <li>VPN interference</li>
              <li>Poor internet connection</li>
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className={`${
              onRetry ? 'flex-1' : 'w-full'
            } bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors`}
          >
            {type === 'mic-permission' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}