import React, { useState } from 'react';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      alert('Registration error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card-elevated" style={{ maxWidth: '400px', margin: 'var(--space-16) auto' }}>
        <div className="text-center mb-6">
          <h1>Join Our Sustainable Community</h1>
          <p className="text-lg">Create your account to start making an impact</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Create a secure password"
              required 
            />
            <div className="text-sm text-stone mt-2">
              Use at least 8 characters with a mix of letters and numbers
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-cloud rounded-lg">
          <h4 className="text-base mb-2">🌱 What you'll get:</h4>
          <ul className="text-sm text-stone space-y-1">
            <li>• Access to AI-powered agriculture assistant</li>
            <li>• Sustainable farming tools and insights</li>
            <li>• Track your environmental impact</li>
            <li>• Join a community of eco-conscious users</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-stone">
            Already have an account?{' '}
            <button 
              onClick={() => props.setCurrentView('login')}
              className="btn btn-outline text-sm"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;