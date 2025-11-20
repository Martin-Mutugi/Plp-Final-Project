import React, { useState } from 'react';
import './App.css';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Mock authentication - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Check mock users in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const user = existingUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Create user object for app state (without password)
        const userData = {
          id: user.id,
          email: user.email,
          subscriptionTier: user.subscriptionTier || 'free',
          createdAt: user.createdAt
        };
        
        // Store token and user data (mock token)
        const mockToken = `mock_token_${Date.now()}`;
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(userData));
        props.setUser(userData);
        
        // Success feedback
        console.log('Login successful:', userData);
      } else {
        // Check if email exists but password is wrong
        const emailExists = existingUsers.find(u => u.email === email);
        if (emailExists) {
          throw new Error('Invalid password. Please try again.');
        } else {
          throw new Error('No account found with this email. Please register first.');
        }
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    alert('Password reset feature will be available when backend is connected.');
  };

  const handleContactSupport = () => {
    alert('Please email support@agrismart-sdg.org for assistance.');
  };

  return (
    <div className="container container-narrow">
      <div className="fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card-elevated" style={{ maxWidth: '440px', margin: 'var(--space-20) auto', padding: 'var(--space-10)' }}>
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
            <h2 className="mb-3">Welcome Back</h2>
            <p className="text-lg text-stone leading-relaxed">
              Sign in to continue your sustainable agriculture journey
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-info bg-opacity-10 rounded-lg border border-info border-opacity-20">
            <div className="flex items-start gap-3">
              <span className="text-info text-lg">💡</span>
              <div>
                <p className="text-sm font-semibold text-info">Demo Mode Active</p>
                <p className="text-xs text-stone mt-1">
                  Using mock authentication. Register first if you don't have an account.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card-error mb-6 fade-in">
              <div className="flex items-center gap-3">
                <span className="text-error text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-error">Login Failed</p>
                  <p className="text-sm text-stone">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter your email address"
                  required 
                  disabled={isLoading}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">📧</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter your password"
                  required 
                  disabled={isLoading}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🔒</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="loading"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>Sign In to AgriSmart</span>
                </div>
              )}
            </button>
          </form>

          {/* Test Account Hint */}
          <div className="mt-4 p-3 bg-cloud rounded-lg">
            <p className="text-xs text-stone text-center">
              <strong>Tip:</strong> Register first to create an account, then login with the same credentials.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-cloud"></div>
            <span className="px-4 text-sm text-stone-light">New to our platform?</span>
            <div className="flex-1 h-px bg-cloud"></div>
          </div>

          {/* Registration CTA */}
          <div className="text-center">
            <p className="text-sm text-stone mb-4">
              Join thousands of farmers and consumers building a sustainable future
            </p>
            <button 
              onClick={() => props.setCurrentView('register')}
              className="btn btn-outline w-full"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <span>✨</span>
                <span>Create New Account</span>
              </div>
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-snow rounded-xl border border-cloud">
            <p className="text-xs text-stone text-center">
              Having trouble signing in?{' '}
              <button 
                onClick={handleResetPassword}
                className="text-emerald hover:text-emerald-dark font-semibold"
              >
                Reset your password
              </button>
              {' or '}
              <button 
                onClick={handleContactSupport}
                className="text-emerald hover:text-emerald-dark font-semibold"
              >
                contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;