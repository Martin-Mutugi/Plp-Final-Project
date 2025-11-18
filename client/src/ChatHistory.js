import React, { useState, useEffect } from 'react';
import './App.css';

function ChatHistory({ user }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/history/${user.id}`);
        if (response.ok) {
          const chats = await response.json();
          setChatSessions(chats);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.id) {
      fetchChatHistory();
    }
  }, [user.id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSessionMessages = (sessionId) => {
    return chatSessions.filter(chat => chat.sessionId === sessionId);
  };

  const groupedSessions = chatSessions.reduce((acc, chat) => {
    if (!acc[chat.sessionId]) {
      acc[chat.sessionId] = {
        sessionId: chat.sessionId,
        messages: [],
        lastTimestamp: chat.timestamp
      };
    }
    acc[chat.sessionId].messages.push(chat);
    if (new Date(chat.timestamp) > new Date(acc[chat.sessionId].lastTimestamp)) {
      acc[chat.sessionId].lastTimestamp = chat.timestamp;
    }
    return acc;
  }, {});

  const sessionList = Object.values(groupedSessions).sort((a, b) => 
    new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
              <div className="loading" style={{ width: '32px', height: '32px' }}></div>
            </div>
          </div>
          <h2 className="mb-4">Loading Chat History</h2>
          <p className="text-lg text-stone">Retrieving your conversation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald to-teal rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📚</span>
          </div>
        </div>
        <h1 className="mb-4">Chat History</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
          Review your previous conversations with the AgriSmart AI Assistant and track your sustainable agriculture journey
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {sessionList.length === 0 ? (
          <div className="card-elevated text-center py-16 fade-in">
            <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-4">No Conversation History</h3>
            <p className="text-stone mb-6 leading-relaxed">
              You haven't had any conversations with the AI assistant yet. 
              Start chatting to get personalized sustainable agriculture advice and build your history.
            </p>
            <div className="bg-snow rounded-xl p-6 border border-cloud">
              <h4 className="font-semibold text-charcoal mb-3">💡 Get Started</h4>
              <p className="text-sm text-stone">
                Ask about crop planning, pest management, climate-smart practices, 
                or any other sustainable agriculture topics to begin your journey.
              </p>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            {/* Session List */}
            <div className="card-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sky to-ocean rounded-xl flex items-center justify-center">
                  <span className="text-lg text-white">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">Your Conversations</h3>
                  <p className="text-sm text-stone">{sessionList.length} chat sessions</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sessionList.map((session, index) => (
                  <div 
                    key={session.sessionId}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedSession?.sessionId === session.sessionId
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald shadow-md'
                        : 'bg-snow border-cloud hover:border-emerald hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedSession(selectedSession?.sessionId === session.sessionId ? null : session)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-light rounded-lg flex items-center justify-center">
                          <span className="text-emerald text-sm">💭</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal">
                            Session {index + 1}
                          </h4>
                          <p className="text-sm text-stone">
                            {session.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-stone-light mb-1">
                          {formatDate(session.lastTimestamp)}
                        </div>
                        <div className="text-xs bg-charcoal bg-opacity-10 text-charcoal px-2 py-1 rounded-full font-medium">
                          {new Date(session.lastTimestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* First message preview */}
                    {session.messages[0] && (
                      <div className="mt-3 p-3 bg-cloud rounded-lg">
                        <p className="text-sm text-charcoal line-clamp-2 leading-relaxed">
                          {session.messages[0].message}
                        </p>
                      </div>
                    )}

                    {/* Expanded session messages */}
                    {selectedSession?.sessionId === session.sessionId && (
                      <div className="mt-4 space-y-3 border-t border-cloud pt-4">
                        <h5 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                          <span>📝</span>
                          Full Conversation
                        </h5>
                        {session.messages.map((chat, msgIndex) => (
                          <div key={msgIndex} className="space-y-2">
                            {/* User Message */}
                            <div className="flex justify-end">
                              <div className="bg-gradient-emerald text-white p-3 rounded-2xl rounded-br-sm max-w-80">
                                <p className="text-sm leading-relaxed">{chat.message}</p>
                              </div>
                            </div>
                            
                            {/* AI Response */}
                            {chat.response && (
                              <div className="flex justify-start">
                                <div className="bg-snow border border-cloud p-3 rounded-2xl rounded-bl-sm max-w-80">
                                  <p className="text-sm text-charcoal leading-relaxed">{chat.response}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t border-cloud">
                <div className="grid grid-3 gap-4 text-center">
                  <div className="p-3 bg-snow rounded-xl border border-cloud">
                    <div className="text-lg font-bold text-forest">{sessionList.length}</div>
                    <div className="text-xs text-stone">Total Sessions</div>
                  </div>
                  <div className="p-3 bg-snow rounded-xl border border-cloud">
                    <div className="text-lg font-bold text-teal">
                      {chatSessions.length}
                    </div>
                    <div className="text-xs text-stone">Total Messages</div>
                  </div>
                  <div className="p-3 bg-snow rounded-xl border border-cloud">
                    <div className="text-lg font-bold text-emerald">
                      {sessionList.length > 0 ? formatDate(sessionList[0].lastTimestamp) : 'Never'}
                    </div>
                    <div className="text-xs text-stone">Last Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 card card-info">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-info rounded-xl flex items-center justify-center">
                  <span className="text-lg text-white">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Your Learning Journey</h4>
                  <p className="text-sm text-stone leading-relaxed">
                    Reviewing past conversations helps reinforce sustainable agriculture knowledge 
                    and track your progress in implementing climate-smart practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHistory;