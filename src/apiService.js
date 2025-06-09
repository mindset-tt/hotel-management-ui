import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust if your backend runs elsewhere
export const USE_DUMMY_DATA_ON_ERROR = true; // Set to true to fallback to dummy data

// --- Dummy Data ---
export const DUMMY_ROOM_NUMBERS = [
    "101", "102", "103", "104",
    "201", "202", "203", "204", "205", "206", "207",
    "301", "302", "303", "304", "305", "306", "307",
    "401", "402", "403", "404", "405", "406", "407"
];

export let dummyRoomsData = DUMMY_ROOM_NUMBERS.map((rn, index) => ({
  room_number: rn,
  status: index % 3 === 0 ? 'reserved' : (index % 3 === 1 ? 'maintenance' : 'available'),
  reserved_from: index % 3 === 0 ? new Date(new Date().setDate(new Date().getDate() + index)).toISOString().split('T')[0] : null,
  reserved_to: index % 3 === 0 ? new Date(new Date().setDate(new Date().getDate() + index + 2)).toISOString().split('T')[0] : null,
  notes: index % 3 === 0 ? `Reserved for event ${rn}` : (index % 3 === 1 ? `Undergoing deep cleaning` : `Ready for guests`),
}));

const dummyChatResponse = {
  reply: "This is a dummy response from the chatbot as the backend is currently unavailable. I can tell you that the sky is blue!",
  source: "DummySystem"
};

// --- API Service ---
const apiService = {
  askChatbot: async (text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Chatbot request failed');
      }
      return response.json();
    } catch (error) {
      console.warn("API Error (askChatbot):", error.message);
      if (USE_DUMMY_DATA_ON_ERROR) {
        return Promise.resolve({ ...dummyChatResponse, reply: `(Dummy Data) Backend unavailable. Original query: "${text}". My dummy reply: ${dummyChatResponse.reply}` });
      }
      throw error;
    }
  },
  getAllRooms: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/`);
      if (!response.ok) throw new Error('Failed to fetch rooms. Is the backend server running?');
      return response.json();
    } catch (error) {
      console.warn("API Error (getAllRooms):", error.message);
      if (USE_DUMMY_DATA_ON_ERROR) {
        return Promise.resolve(JSON.parse(JSON.stringify(dummyRoomsData))); // Return a deep copy
      }
      throw error;
    }
  },
  updateRoom: async (roomNumber, data, isDemoMode) => {
    if (isDemoMode && USE_DUMMY_DATA_ON_ERROR) {
        console.log(`(Dummy Update) Updating room ${roomNumber} with:`, data);
        const roomIndex = dummyRoomsData.findIndex(r => r.room_number === roomNumber);
        if (roomIndex !== -1) {
            dummyRoomsData[roomIndex] = { ...dummyRoomsData[roomIndex], ...data };
            // Ensure date formats are consistent if they are strings
            if (data.reserved_from && typeof data.reserved_from === 'string') {
                 dummyRoomsData[roomIndex].reserved_from = data.reserved_from.split('T')[0];
            }
            if (data.reserved_to && typeof data.reserved_to === 'string') {
                 dummyRoomsData[roomIndex].reserved_to = data.reserved_to.split('T')[0];
            }
        }
        return Promise.resolve({ ...dummyRoomsData[roomIndex] });
    }
    // Real API call
    const payload = { ...data };
     if (payload.reserved_from && typeof payload.reserved_from === 'string' && payload.reserved_from.includes('T')) {
      payload.reserved_from = payload.reserved_from.split('T')[0];
    } else if (payload.reserved_from === '') {
        payload.reserved_from = null;
    }
    if (payload.reserved_to && typeof payload.reserved_to === 'string' && payload.reserved_to.includes('T')) {
      payload.reserved_to = payload.reserved_to.split('T')[0];
    } else if (payload.reserved_to === '') {
        payload.reserved_to = null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update room');
        }
        return response.json();
    } catch (error) {
        console.warn(`API Error (updateRoom ${roomNumber}):`, error.message);
        // No dummy fallback for update failure, just throw
        throw error;
    }
  },
};


export default apiService;