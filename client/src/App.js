import React, { useState, useEffect } from 'react';
import PublicDashboard from './PublicDashboard';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthAndPayment = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }

      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const userId = urlParams.get('userId');
      
      if (paymentStatus === 'success') {
        if (userId && storedToken) {
          try {
            alert('Payment successful! Your account has been upgraded to Premium. Please log in again to see your updated account.');
          } catch (error) {
            alert('Payment successful! Please log in again to see your upgraded account.');
          }
        } else {
          alert('Payment successful! Please log in again to see your upgraded account.');
        }
        
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    checkAuthAndPayment();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  AgriSmart
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Public Dashboard
              </button>
              
              {!user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentView('login')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentView === 'login'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentView('register')}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {user.email}
                      </span>
                      {user.subscriptionTier !== 'free' && (
                        <span className={`text-xs font-semibold ${
                          user.subscriptionTier === 'pro' 
                            ? 'text-purple-600' 
                            : 'text-yellow-600'
                        }`}>
                          {user.subscriptionTier === 'pro' ? '🚀 Pro' : '⭐ Premium'}
                        </span>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:border-gray-400 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Public Dashboard
                </button>
                
                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView('login');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        currentView === 'login'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-sm text-center"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      {user.subscriptionTier !== 'free' && (
                        <span className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded ${
                          user.subscriptionTier === 'pro' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.subscriptionTier === 'pro' ? '🚀 Pro' : '⭐ Premium'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg text-center hover:border-gray-400 transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {user ? (
          <UserDashboard user={user} setUser={setUser} />
        ) : (
          <>
            {currentView === 'dashboard' && <PublicDashboard />}
            {currentView === 'login' && <Login setUser={setUser} setCurrentView={setCurrentView} />}
            {currentView === 'register' && <Register setCurrentView={setCurrentView} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-green-400">🌍</span>
                <span>Our Mission</span>
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Advancing UN Sustainable Development Goals through AI-powered sustainable agriculture. 
                Building a future where technology and ecology work hand in hand.
              </p>
            </div>
            
            {/* Impact Goals */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-green-400">🎯</span>
                <span>Impact Goals</span>
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                {['SDG 2: Zero Hunger', 'SDG 12: Responsible Consumption', 'SDG 13: Climate Action'].map((goal, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-green-400">📞</span>
                <span>Get In Touch</span>
              </h4>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>support@agrismart-sdg.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>www.agrismart-sdg.org</span>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-2">
                {['📘', '🐦', '📸'].map((icon, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <p className="text-gray-400 text-sm text-center md:text-left">
                  &copy; 2024 AgriSmart SDG Platform. Building a sustainable future together.
                </p>
              </div>
              
              <div className="flex space-x-6 text-gray-400 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                  <button
                    key={index}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;