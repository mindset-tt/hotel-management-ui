import React from 'react';
import { FiLoader, FiAlertCircle, FiDatabase } from 'react-icons/fi';
// --- Helper Components ---
// --- Helper Components ---
function LoadingSpinner({ size = 'h-8 w-8', color = 'text-indigo-500' }) {
  return (
    <div className="flex justify-center items-center p-4">
      <FiLoader className={`animate-spin ${size} ${color}`} />
    </div>
  );
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 my-4 rounded-md shadow-md" role="alert">
      <div className="flex items-center">
        <FiAlertCircle className="h-6 w-6 mr-3" />
        <div>
            <p className="font-bold">Error</p>
            <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

function DemoModeNotification({ isActive }) {
    if (!isActive) return null;
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 my-4 rounded-md shadow-md" role="status">
            <div className="flex items-center">
                <FiDatabase className="h-6 w-6 mr-3" />
                <div>
                    <p className="font-bold">Dummy Data Mode</p>
                    <p>The application could not connect to the backend. Displaying sample data. Changes will not be saved.</p>
                </div>
            </div>
        </div>
    );
}

export { LoadingSpinner, ErrorMessage, DemoModeNotification };