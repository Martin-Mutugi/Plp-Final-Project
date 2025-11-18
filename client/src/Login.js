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
    
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/login`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        props.setUser(data.user);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
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
              <button className="text-emerald hover:text-emerald-dark font-semibold">
                Reset your password
              </button>
              {' or '}
              <button className="text-emerald hover:text-emerald-dark font-semibold">
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