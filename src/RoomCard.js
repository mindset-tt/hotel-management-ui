import React, { useState, useEffect } from 'react';
import apiService from './apiService'; // Adjust the import path as needed
// import { ErrorMessage, LoadingSpinner } from './helper';
import { FiEdit2, FiSave, FiXCircle, FiLoader } from 'react-icons/fi';

// --- Room Components ---
function RoomCard({ room, onUpdateSuccess, isDemoMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(room.status);
  const formatDateForInput = (dateStr) => dateStr ? dateStr.split('T')[0] : '';
  const [reservedFrom, setReservedFrom] = useState(formatDateForInput(room.reserved_from));
  const [reservedTo, setReservedTo] = useState(formatDateForInput(room.reserved_to));
  const [notes, setNotes] = useState(room.notes || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { // Sync with room prop changes, e.g., after dummy update
    setStatus(room.status);
    setReservedFrom(formatDateForInput(room.reserved_from));
    setReservedTo(formatDateForInput(room.reserved_to));
    setNotes(room.notes || '');
  }, [room]);


  const handleSave = async () => {
    setError('');
    setIsLoading(true);
    
    if (status === 'reserved' && (!reservedFrom || !reservedTo)) {
      setError('For "Reserved" status, both "Reserved From" and "Reserved To" dates are required.');
      setIsLoading(false);
      return;
    }
    if (status === 'reserved' && reservedFrom && reservedTo && new Date(reservedFrom) > new Date(reservedTo)) {
        setError('"Reserved From" date cannot be after "Reserved To" date.');
        setIsLoading(false);
        return;
    }

    const updateData = {
      status,
      reserved_from: status === 'reserved' && reservedFrom ? reservedFrom : null,
      reserved_to: status === 'reserved' && reservedTo ? reservedTo : null,
      notes,
    };

    try {
      await apiService.updateRoom(room.room_number, updateData, isDemoMode);
      setIsEditing(false);
      onUpdateSuccess(); 
    } catch (err) {
      setError(err.message || 'Failed to save room details.');
       if (isDemoMode) { // If in demo mode, error is likely from validation, not API
            console.error("Dummy save error:", err.message);
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus(room.status);
    setReservedFrom(formatDateForInput(room.reserved_from));
    setReservedTo(formatDateForInput(room.reserved_to));
    setNotes(room.notes || '');
    setIsEditing(false);
    setError('');
  };

  const getStatusColor = (currentStatus) => {
    if (currentStatus === 'available') return 'bg-green-100 text-green-700';
    if (currentStatus === 'reserved') return 'bg-red-100 text-red-700';
    if (currentStatus === 'maintenance') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Room {room.room_number}</h3>
            {!isEditing && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
            )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor={`status-${room.room_number}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                id={`status-${room.room_number}`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {status === 'reserved' && (
              <>
                <div>
                  <label htmlFor={`from-${room.room_number}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reserved From</label>
                  <input
                    type="date"
                    id={`from-${room.room_number}`}
                    value={reservedFrom}
                    onChange={(e) => setReservedFrom(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`to-${room.room_number}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reserved To</label>
                  <input
                    type="date"
                    id={`to-${room.room_number}`}
                    value={reservedTo}
                    onChange={(e) => setReservedTo(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor={`notes-${room.room_number}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <textarea
                id={`notes-${room.room_number}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add notes..."
              />
            </div>
            {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
          </div>
        ) : (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {room.status === 'reserved' && room.reserved_from && room.reserved_to && (
              <p><strong>Reserved:</strong> {new Date(room.reserved_from).toLocaleDateString()} - {new Date(room.reserved_to).toLocaleDateString()}</p>
            )}
            {room.notes && <p className="whitespace-pre-wrap"><strong>Notes:</strong> {room.notes}</p>}
            {!room.notes && room.status !== 'reserved' && <p className="italic">No additional details.</p>}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 flex items-center"
            >
              <FiXCircle className="mr-2 h-4 w-4"/> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 flex items-center"
            >
              {isLoading ? <FiLoader className="animate-spin mr-2 h-4 w-4"/> : <FiSave className="mr-2 h-4 w-4"/>}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 flex items-center"
          >
            <FiEdit2 className="mr-2 h-4 w-4"/> Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomCard;