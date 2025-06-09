import React, { useState, useEffect, useCallback } from 'react';
import apiService, { DUMMY_ROOM_NUMBERS, dummyRoomsData, USE_DUMMY_DATA_ON_ERROR } from './apiService'; // Adjust the import path as needed
import { ErrorMessage, LoadingSpinner } from './helper';
import ChatMessage from './chatMessage'; // Adjust the import path as needed
import RoomCard from './RoomCard'; // Adjust the import path as needed
import { DemoModeNotification } from './helper'; // Adjust the import path as needed
function AdminPanel() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setIsDemoMode(false); // Reset demo mode on each fetch attempt
    try {
      const data = await apiService.getAllRooms();
      // Check if the data returned is our dummy data structure
      if (data && data.length > 0 && data[0].room_number === DUMMY_ROOM_NUMBERS[0] && error) {
        // This condition might be too simple, better to rely on error from apiService
      }
      data.sort((a, b) => a.room_number.localeCompare(b.room_number));
      setRooms(data);
    } catch (err) {
      setError(err.message || 'Failed to load rooms.');
      if (USE_DUMMY_DATA_ON_ERROR) {
        console.log("Falling back to dummy room data due to API error.");
        const dummyDataCopy = JSON.parse(JSON.stringify(dummyRoomsData)); // Use a fresh copy
        dummyDataCopy.sort((a, b) => a.room_number.localeCompare(b.room_number));
        setRooms(dummyDataCopy);
        setIsDemoMode(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">Admin Room Dashboard</h2>
      <DemoModeNotification isActive={isDemoMode} />
      {isLoading && <LoadingSpinner size="h-12 w-12" />}
      <ErrorMessage message={!isDemoMode ? error : ''} /> {/* Only show API error if not in demo mode */}

      {!isLoading && rooms.length === 0 && !error && !isDemoMode &&
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">No rooms found. Backend might be unavailable or no rooms configured.</p>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.room_number} room={room} onUpdateSuccess={fetchRooms} isDemoMode={isDemoMode} />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;