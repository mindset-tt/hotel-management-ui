// --- Chat Panel Components ---
function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`px-4 py-2 rounded-lg shadow ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
        style={{ maxWidth: '70%' }}
      >
        {isUser ? message : <p className="whitespace-pre-wrap">{message}</p>}
      </div>
    </div>
  );
}

export default ChatMessage;