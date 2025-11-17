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
      // Check for stored user session on app load
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }

      // Check if user just completed a payment
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const userId = urlParams.get('userId');
      
      if (paymentStatus === 'success') {
        if (userId && storedToken) {
          // Try to refresh user data to get updated subscription
          try {
            // For now, we'll just show success message and rely on next login
            alert('Payment successful! Your account has been upgraded to Premium. Please log in again to see your updated account.');
          } catch (error) {
            alert('Payment successful! Please log in again to see your upgraded account.');
          }
        } else {
          alert('Payment successful! Please log in again to see your upgraded account.');
        }
        
        // Remove the payment parameters from URL
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
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-content">
          <a 
            href="#/" 
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('dashboard');
              setIsMenuOpen(false);
            }}
          >
            <span className="logo-icon">🌱</span>
            AgriSmart SDG
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links hidden-mobile">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              Public Dashboard
            </button>
            
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
              <div className="flex items-center gap-4">
                <span className="text-sm text-charcoal">
                  Welcome, <strong>{user.email}</strong>
                  {user.subscriptionTier !== 'free' && (
                    <span className="sdg-badge ml-2">
                      {user.subscriptionTier === 'pro' ? '🚀 Pro' : '⭐ Premium'}
                    </span>
                  )}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="btn btn-outline block-mobile hidden-desktop"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav hidden-desktop">
            <div className="flex flex-col gap-3 p-4 bg-white">
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
                  <div className="p-3 bg-cloud rounded-lg">
                    <p className="text-sm font-semibold">Welcome, {user.email}</p>
                    {user.subscriptionTier !== 'free' && (
                      <span className="sdg-badge mt-1">
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
      <footer className="bg-charcoal text-white py-8 mt-16">
        <div className="container">
          <div className="grid grid-3 text-center">
            <div>
              <h4 className="text-white mb-4">🌍 Our Mission</h4>
              <p className="text-sm opacity-80">
                Advancing UN Sustainable Development Goals through AI-powered sustainable agriculture
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">🎯 Impact Goals</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>SDG 2: Zero Hunger</li>
                <li>SDG 12: Responsible Consumption</li>
                <li>SDG 13: Climate Action</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">📞 Contact</h4>
              <p className="text-sm opacity-80">
                support@agrismart-sdg.org
              </p>
            </div>
          </div>
          <div className="text-center mt-8 pt-6 border-t border-stone">
            <p className="text-sm opacity-60">
              &copy; 2024 AgriSmart SDG Platform. Building a sustainable future together.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hidden-mobile {
          display: flex;
        }
        .hidden-desktop {
          display: none;
        }
        .block-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none;
          }
          .hidden-desktop {
            display: block;
          }
          .block-mobile {
            display: block;
          }
        }
        .mobile-nav {
          border-top: 1px solid var(--neutral-cloud);
        }
      `}</style>
    </div>
  );
}

export default App;