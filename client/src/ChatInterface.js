import React, { useState, useEffect, useRef } from 'react';

function ChatInterface({ user, setUser }) {
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
    <div className="chat-container">
      {/* Sessions Sidebar */}
      <div className="chat-sidebar">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="mb-4">
            <button 
              onClick={startNewChat}
              className="btn btn-primary w-full mb-3"
            >
              <span className="text-lg mr-2">+</span>
              New Chat
            </button>
            
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span>💬</span>
              Chat History
            </h4>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center text-stone p-4">
                <div className="text-2xl mb-2">📚</div>
                <p className="text-sm">No previous chats</p>
                <p className="text-xs">Start a conversation to see history here</p>
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session._id}
                  onClick={() => loadChatSession(session._id)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                    currentSessionId === session._id 
                      ? 'bg-emerald bg-opacity-10 border border-emerald border-opacity-30' 
                      : 'bg-cloud hover:bg-cloud-dark border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-stone">
                      {new Date(session.lastTimestamp).toLocaleDateString()}
                    </div>
                    <span className="text-xs bg-charcoal bg-opacity-10 text-charcoal px-1 rounded">
                      {session.messageCount}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-charcoal line-clamp-2">
                    {session.lastMessage || 'New conversation'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-cloud">
            <div className="text-xs text-stone text-center">
              {user.subscriptionTier === 'free' ? (
                <p>{6 - (user.promptsUsed || 0)} prompts remaining</p>
              ) : (
                <p>✨ Unlimited AI access</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header p-4 border-b border-cloud bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal flex items-center gap-2">
              <span className="text-lg">🌱</span>
              AgriSmart AI Assistant
            </h3>
            
            {/* Language Selector for Premium Users */}
            {user.subscriptionTier !== 'free' && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-charcoal">Language:</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="form-select text-sm"
                  style={{ width: 'auto', minWidth: '120px' }}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="swahili">Swahili</option>
                  <option value="hindi">Hindi</option>
                  <option value="arabic">Arabic</option>
                  <option value="portuguese">Portuguese</option>
                </select>
                <span className="sdg-badge text-xs">
                  🌍 Premium
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {chatHistory.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                Welcome to AgriSmart AI
              </h3>
              <p className="text-stone max-w-md mx-auto">
                Ask me anything about sustainable agriculture, crop planning, 
                climate-smart practices, or food waste reduction.
              </p>
              <div className="mt-6 grid grid-2 gap-3 max-w-lg mx-auto">
                <button 
                  onClick={() => setMessage("How can I improve soil health for maize cultivation?")}
                  className="btn btn-outline text-sm text-left justify-start"
                >
                  🌱 Soil health tips
                </button>
                <button 
                  onClick={() => setMessage("What are climate-smart irrigation practices?")}
                  className="btn btn-outline text-sm text-left justify-start"
                >
                  💧 Irrigation advice
                </button>
                <button 
                  onClick={() => setMessage("How can I reduce food waste at home?")}
                  className="btn btn-outline text-sm text-left justify-start"
                >
                  🗑️ Reduce food waste
                </button>
                <button 
                  onClick={() => setMessage("Best sustainable crops for my region")}
                  className="btn btn-outline text-sm text-left justify-start"
                >
                  🌍 Regional crops
                </button>
              </div>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`message ${chat.type === 'user' ? 'message-user' : 'message-ai'}`}
            >
              <div className="message-bubble">
                {chat.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message message-ai">
              <div className="message-bubble">
                <div className="flex items-center gap-2">
                  <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                  <span className="text-stone">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about sustainable agriculture, crop planning, climate practices..."
              className="form-input flex-1"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary px-6"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                  Sending...
                </div>
              ) : (
                'Send'
              )}
            </button>
          </form>
          
          {/* Quick Tips */}
          <div className="mt-3 text-xs text-stone text-center">
            💡 Try asking about: organic farming, pest management, water conservation, or sustainable diets
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;