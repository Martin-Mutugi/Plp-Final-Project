import React, { useState, useEffect } from 'react';

function ChatHistory({ user }) {
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history/${user.id}`);
        if (response.ok) {
          const chats = await response.json();
          setChatSessions(chats);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    if (user.id) {
      fetchChatHistory();
    }
  }, [user.id]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>📚 Your Chat History</h3>
      {chatSessions.length === 0 ? (
        <p>No previous conversations found.</p>
      ) : (
        <div>
          {chatSessions.map(chat => (
            <div key={chat._id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              marginBottom: '10px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {new Date(chat.timestamp).toLocaleDateString()}
              </div>
              <div style={{ marginTop: '5px' }}>
                {chat.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatHistory;