import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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
          <div className="mb-6">
            <button 
              onClick={startNewChat}
              className="btn btn-primary w-full mb-4 btn-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">+</span>
                <span>New Chat Session</span>
              </div>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-emerald rounded-xl flex items-center justify-center">
                <span className="text-white">💬</span>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal">Chat History</h4>
                <p className="text-xs text-stone">{sessions.length} sessions</p>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-sm text-stone mb-1">No previous chats</p>
                <p className="text-xs text-stone-light">Start a conversation to see history here</p>
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session._id}
                  onClick={() => loadChatSession(session._id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    currentSessionId === session._id 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald shadow-md' 
                      : 'bg-snow border-cloud hover:border-emerald hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-stone-light">
                      {new Date(session.lastTimestamp).toLocaleDateString()}
                    </div>
                    <span className="text-xs bg-charcoal bg-opacity-10 text-charcoal px-2 py-1 rounded-lg font-medium">
                      {session.messageCount} messages
                    </span>
                  </div>
                  <div className="text-sm font-medium text-charcoal line-clamp-2 leading-relaxed">
                    {session.lastMessage || 'New conversation'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-cloud mt-4">
            <div className="text-center p-4 bg-snow rounded-xl border border-cloud">
              {user.subscriptionTier === 'free' ? (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-warning">Free Plan</div>
                  <div className="text-xs text-stone">
                    {6 - (user.promptsUsed || 0)} prompts remaining
                  </div>
                  <div className="w-full bg-cloud rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full transition-all"
                      style={{ width: `${((user.promptsUsed || 0) / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-success flex items-center justify-center gap-1">
                    <span>✨</span>
                    <span>Unlimited Access</span>
                  </div>
                  <div className="text-xs text-stone">
                    {user.subscriptionTier === 'pro' ? 'Pro Plan' : 'Premium Plan'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header p-6 border-b border-cloud bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl text-white">🌱</span>
              </div>
              <div>
                <h3 className="font-bold text-charcoal text-lg">AgriSmart AI Assistant</h3>
                <p className="text-sm text-stone">Your sustainable agriculture expert</p>
              </div>
            </div>
            
            {/* Language Selector for Premium Users */}
            {user.subscriptionTier !== 'free' && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-charcoal">Language:</label>
                  <select 
                    value={selectedLanguage} 
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="form-select text-sm"
                    style={{ width: 'auto', minWidth: '140px' }}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="swahili">Swahili</option>
                    <option value="hindi">Hindi</option>
                    <option value="arabic">Arabic</option>
                    <option value="portuguese">Portuguese</option>
                  </select>
                </div>
                <span className="sdg-badge sdg-badge-premium text-xs">
                  🌍 Multi-Language
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {chatHistory.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald to-teal rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🌾</span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4">
                Welcome to AgriSmart AI
              </h3>
              <p className="text-lg text-stone max-w-2xl mx-auto mb-8 leading-relaxed">
                Ask me anything about sustainable agriculture, crop planning, 
                climate-smart practices, or food waste reduction. I'm here to help you make smarter, more sustainable choices.
              </p>
              <div className="grid grid-2 gap-4 max-w-xl mx-auto">
                {[
                  { icon: '🌱', text: 'Soil health tips for maize cultivation' },
                  { icon: '💧', text: 'Climate-smart irrigation practices' },
                  { icon: '🗑️', text: 'Reduce food waste at home' },
                  { icon: '🌍', text: 'Best sustainable crops for my region' }
                ].map((suggestion, index) => (
                  <button 
                    key={index}
                    onClick={() => setMessage(suggestion.text)}
                    className="btn btn-outline text-left justify-start p-4 hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{suggestion.icon}</span>
                      <span className="text-sm">{suggestion.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`message ${chat.type === 'user' ? 'message-user' : 'message-ai'} fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {chat.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-emerald rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">🌱</span>
                </div>
              )}
              <div className={`message-bubble ${chat.type === 'user' ? 'message-user-bubble' : 'message-ai-bubble'}`}>
                {chat.content}
              </div>
              {chat.type === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-sky to-ocean rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">👤</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="message message-ai fade-in">
              <div className="w-8 h-8 bg-gradient-emerald rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs">🌱</span>
              </div>
              <div className="message-bubble message-ai-bubble">
                <div className="flex items-center gap-3">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="text-stone">Analyzing your question...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about sustainable agriculture, crop planning, climate practices..."
                className="form-input w-full pl-12 pr-4 py-4 text-lg rounded-2xl"
                disabled={isLoading}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light text-xl">💭</span>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary px-8 py-4 rounded-2xl btn-lg"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>Send</span>
                </div>
              )}
            </button>
          </form>
          
          {/* Quick Tips */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-snow rounded-xl border border-cloud">
              <span className="text-emerald">💡</span>
              <span className="text-sm text-stone">
                Try asking about: organic farming, pest management, water conservation, or sustainable diets
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;