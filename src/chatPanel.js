import React, { useState, useEffect, useRef } from 'react';
import apiService from './apiService'; // Adjust the import path as needed
import { FiSend, FiLoader } from 'react-icons/fi';
import { DemoModeNotification } from './helper'; // Adjust the import path as needed

// --- Chat Panel Components ---
function ChatMessageDisplay({ message, isUser, source }) {
  const isError = source === 'Error';
  const isDummy = source === 'DummySystem';
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`py-2 px-4 rounded-xl shadow-md max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl break-words ${
          isUser
            ? 'bg-indigo-500 text-white rounded-br-none'
            : isError 
            ? 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded-bl-none'
            : isDummy
            ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 rounded-bl-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {!isUser && source && source !== 'System' && !isError && (
            <p className="text-xs mt-1 opacity-70 text-right">
            Source: {source}
            </p>
        )}
      </div>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState([{ text: "Hello! I'm your hotel assistant. How can I help you today?", isUser: false, source: "System" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] // eslint-disable-line no-unused-vars 
    = useState(''); 
  const [isDemoMode, setIsDemoMode] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => { 
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true, source: "User" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError('');
    setIsDemoMode(false); // Reset demo mode for chat on new message

    try {
      const response = await apiService.askChatbot(currentInput);
      if (response.source === "DummySystem") {
        setIsDemoMode(true);
      }
      const botMessage = { text: response.reply, isUser: false, source: response.source };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessageText = err.message || 'Failed to get response from chatbot.';
      // setError(errorMessageText); // Not using a global error display for chat for now
      const errorMessage = { text: `Sorry, I encountered an error: ${errorMessageText}`, isUser: false, source: "Error" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus(); 
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">Hotel Chat Assistant</h2>
        </div>
        <DemoModeNotification isActive={isDemoMode && messages.some(m => m.source === "DummySystem")} />


        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-100 dark:bg-gray-900">
            {messages.map((msg, index) => (
                <ChatMessageDisplay key={index} message={msg.text} isUser={msg.isUser} source={msg.source} />
            ))}
            <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about the hotel or rooms..."
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLoading}
                />
                <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 flex items-center justify-center w-12 h-12"
                aria-label="Send message"
                >
                {isLoading ? <FiLoader className="animate-spin h-5 w-5"/> : <FiSend className="h-5 w-5"/>}
                </button>
            </form>
        </div>
    </div>
  );
}

export { ChatPanel, ChatMessageDisplay };