import React, { useState, useEffect } from 'react';
import PublicDashboard from './PublicDashboard';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';
//import PaymentCallback from './components/PaymentCallback';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

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
    <ThemeProvider>
      <div className="app-container">
        {/* Navigation Header */}
        <nav className="navbar">
          <div className="nav-content">
            {/* Logo */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className="logo"
            >
              <span className="logo-icon">🌱</span>
              AgriSmart SDG
            </button>

            {/* Desktop Navigation */}
            <div className="nav-links hidden-mobile">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              >
                Public Dashboard
              </button>
              
              {/* Theme Toggle in Desktop Navigation */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                
                {!user ? (
                  <>
                    <button 
                      onClick={() => setCurrentView('login')}
                      className={`nav-link ${currentView === 'login' ? 'active' : ''}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setCurrentView('register')}
                      className="btn btn-primary"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-semibold text-charcoal">
                          {user.email}
                        </span>
                        {user.subscriptionTier !== 'free' && (
                          <span className={`sdg-badge ${user.subscriptionTier === 'premium' ? 'sdg-badge-premium' : ''}`}>
                            {user.subscriptionTier === 'pro' ? '🚀 Pro' : '⭐ Premium'}
                          </span>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-gradient-emerald rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="btn btn-outline"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button with Theme Toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button 
                className="btn btn-outline block-mobile hidden-desktop"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="mobile-nav hidden-desktop">
              <div className="flex flex-col gap-4 p-6 bg-white">
                {/* Theme Toggle in Mobile Menu */}
                <div className="flex justify-center mb-2">
                  <ThemeToggle />
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`nav-link text-left ${currentView === 'dashboard' ? 'active' : ''}`}
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
                      className={`nav-link text-left ${currentView === 'login' ? 'active' : ''}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentView('register');
                        setIsMenuOpen(false);
                      }}
                      className="btn btn-primary w-full"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <div className="card p-4">
                      <p className="text-sm font-semibold text-charcoal">Welcome back!</p>
                      <p className="text-sm text-stone truncate">{user.email}</p>
                      {user.subscriptionTier !== 'free' && (
                        <span className={`sdg-badge mt-2 ${user.subscriptionTier === 'premium' ? 'sdg-badge-premium' : ''}`}>
                          {user.subscriptionTier === 'pro' ? '🚀 Pro' : '⭐ Premium'}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="btn btn-outline w-full"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
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
        <footer className="bg-charcoal text-white py-12">
          <div className="container">
            <div className="grid grid-3 gap-8">
              {/* Mission */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>🌍</span>
                  Our Mission
                </h4>
                <p className="text-cloud text-sm leading-relaxed">
                  Advancing UN Sustainable Development Goals through AI-powered sustainable agriculture. 
                  Building a future where technology and ecology work hand in hand.
                </p>
              </div>
              
              {/* Impact Goals */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>🎯</span>
                  Impact Goals
                </h4>
                <ul className="text-cloud text-sm space-y-2">
                  {['SDG 2: Zero Hunger', 'SDG 12: Responsible Consumption', 'SDG 13: Climate Action'].map((goal, index) => (
                    <li key={index} className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-emerald">✓</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Contact */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>📞</span>
                  Get In Touch
                </h4>
                <div className="text-cloud text-sm space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>📧</span>
                    support@agrismart-sdg.org
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>🌐</span>
                    www.agrismart-sdg.org
                  </div>
                </div>
                
                <div className="flex justify-center md:justify-start gap-4 mt-4">
                  {['📘', '🐦', '📸'].map((icon, index) => (
                    <button
                      key={index}
                      className="w-10 h-10 bg-charcoal-light rounded-lg flex items-center justify-center text-cloud hover:text-white transition-all hover:scale-110"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="mt-8 pt-8 border-t border-stone border-opacity-30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-cloud text-sm">
                    &copy; 2024 AgriSmart SDG Platform. Building a sustainable future together.
                  </p>
                </div>
                
                <div className="flex gap-6 text-cloud text-sm">
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
    </ThemeProvider>
  );
}

export default App;