import React, { useState, useEffect } from 'react';

function ChatInterface({ user, setUser }) {
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Generate a unique session ID
  const generateSessionId = () => {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  // Start a new chat session
  const startNewChat = () => {
    const newSessionId = generateSessionId();
    setCurrentSessionId(newSessionId);
    setChatHistory([]);
    setMessage('');
  };

  // Load a specific chat session
  const loadChatSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/history/${user.id}/${sessionId}`);
      if (response.ok) {
        const chats = await response.json();
        // Convert database format to chat display format
        const formattedChats = chats.flatMap(chat => [
          { type: 'user', content: chat.message },
          { type: 'ai', content: chat.response }
        ]);
        setChatHistory(formattedChats);
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const sessionIdToUse = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      setCurrentSessionId(sessionIdToUse);
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          message: message,
          sessionId: sessionIdToUse,
          language: selectedLanguage
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setChatHistory([...chatHistory, 
          { type: 'user', content: message },
          { type: 'ai', content: data.reply }
        ]);
        setMessage('');
        // Refresh sessions list
        fetchSessions();
        // Update user's prompt count in the parent component
        setUser({
          ...user,
          promptsUsed: data.promptsUsed,
          subscriptionTier: data.subscriptionTier
        });
      } else {
        alert('Chat error: ' + data.error);
      }
    } catch (error) {
      alert('Chat error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/sessions/${user.id}`);
      if (response.ok) {
        const sessionsData = await response.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    startNewChat(); // Start with a new chat by default
  }, [user.id]);

  return (
    <div style={{ display: 'flex', height: '600px' }}>
      {/* Sessions Sidebar */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <button 
          onClick={startNewChat}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          + New Chat
        </button>
        
        <h4>Chat Sessions</h4>
        {sessions.map(session => (
          <div 
            key={session._id}
            onClick={() => loadChatSession(session._id)}
            style={{ 
              padding: '10px',
              marginBottom: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: currentSessionId === session._id ? '#e9ecef' : 'white'
            }}
          >
            <div style={{ fontSize: '12px', color: '#666' }}>
              {new Date(session.lastTimestamp).toLocaleDateString()}
            </div>
            <div style={{ 
              fontSize: '14px', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {session.lastMessage}
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {session.messageCount} messages
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          flex: 1, 
          border: '1px solid #ccc', 
          overflowY: 'scroll', 
          padding: '10px' 
        }}>
          {/* Language Selector for Premium Users */}
          {user.subscriptionTier !== 'free' && (
            <div style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Language: </label>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{ padding: '5px', marginLeft: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="swahili">Swahili</option>
                <option value="hindi">Hindi</option>
                <option value="arabic">Arabic</option>
                <option value="portuguese">Portuguese</option>
              </select>
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                🌍 Premium Feature
              </span>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div key={index} style={{ 
              marginBottom: '10px', 
              textAlign: chat.type === 'user' ? 'right' : 'left' 
            }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 12px', 
                borderRadius: '15px',
                backgroundColor: chat.type === 'user' ? '#007bff' : '#f1f1f1',
                color: chat.type === 'user' ? 'white' : 'black',
                maxWidth: '70%'
              }}>
                {chat.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 12px', 
                borderRadius: '15px',
                backgroundColor: '#f1f1f1',
                color: '#666'
              }}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about sustainable agriculture..."
            style={{ 
              width: 'calc(100% - 80px)', 
              padding: '10px', 
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;