import React, { useState, useEffect } from 'react';
import PublicDashboard from './PublicDashboard';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);

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

  return (
    <div>
      <nav style={{ padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setCurrentView('dashboard')} style={{ marginRight: '10px' }}>
          Public Dashboard
        </button>
        {!user ? (
          <div>
            <button onClick={() => setCurrentView('login')} style={{ marginRight: '10px' }}>
              Login
            </button>
            <button onClick={() => setCurrentView('register')}>
              Register
            </button>
          </div>
        ) : (
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }}>
            Logout
          </button>
        )}
      </nav>

      {user ? (
        <UserDashboard user={user} setUser={setUser} />
      ) : (
        <>
          {currentView === 'dashboard' && <PublicDashboard />}
          {currentView === 'login' && <Login setUser={setUser} />}
          {currentView === 'register' && <Register setCurrentView={setCurrentView} />}
        </>
      )}
    </div>
  );
}

export default App;