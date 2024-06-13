// Alert.js
import React, { useEffect } from 'react';

const Alert = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const alertStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`fixed top-4 right-4 w-96 p-4 rounded-lg shadow-lg z-50 transition-transform transform ${alertStyles[type]}`} role="alert">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{message}</span>
        <button onClick={onClose} className="ml-4">
          <svg className="w-6 h-6 fill-current text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
