import React, { useState } from 'react';
import './App.css';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please log in.');
        props.setCurrentView('login');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
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
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <h2 className="mb-3">Join Our Sustainable Community</h2>
            <p className="text-lg text-stone leading-relaxed">
              Create your account to start making a positive environmental impact
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card-error mb-6 fade-in">
              <div className="flex items-center gap-3">
                <span className="text-error text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-error">Registration Failed</p>
                  <p className="text-sm text-stone">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
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
                  placeholder="Create a secure password"
                  required 
                  disabled={isLoading}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-light">🔒</span>
              </div>
              <div className="text-sm text-stone-light mt-2 flex items-center gap-2">
                <span className="text-emerald">✓</span>
                Use at least 8 characters with a mix of letters and numbers
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>🌍</span>
                  <span>Join AgriSmart Community</span>
                </div>
              )}
            </button>
          </form>

          {/* Benefits Card */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <h4 className="text-base font-semibold text-forest mb-4 flex items-center gap-2">
              <span>🌱</span>
              What You'll Get Access To:
            </h4>
            <ul className="text-sm text-stone space-y-3">
              {[
                { icon: '🤖', text: 'AI-powered sustainable agriculture assistant' },
                { icon: '📊', text: 'Real-time environmental impact tracking' },
                { icon: '🌾', text: 'Smart farming tools and data insights' },
                { icon: '👥', text: 'Global community of eco-conscious users' },
                { icon: '📈', text: 'Personalized sustainability recommendations' }
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-emerald flex-shrink-0 mt-0.5">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-cloud"></div>
            <span className="px-4 text-sm text-stone-light">Already part of our community?</span>
            <div className="flex-1 h-px bg-cloud"></div>
          </div>

          {/* Login CTA */}
          <div className="text-center">
            <p className="text-sm text-stone mb-4">
              Welcome back! Sign in to continue your sustainability journey
            </p>
            <button 
              onClick={() => props.setCurrentView('login')}
              className="btn btn-outline w-full"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>Sign In to Existing Account</span>
              </div>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8">
            <div className="grid grid-3 gap-4 text-center">
              {[
                { icon: '🔒', text: 'Secure & Private' },
                { icon: '🌍', text: 'UN SDG Aligned' },
                { icon: '💚', text: 'Eco-Friendly' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs text-stone-light">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;