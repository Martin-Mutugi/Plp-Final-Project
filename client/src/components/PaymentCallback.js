import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      // Get reference from URL or localStorage
      const reference = searchParams.get('reference') || localStorage.getItem('paymentReference');
      
      if (!reference) {
        setStatus('invalid');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/subscriptions/verify-json/${reference}`
        );
        
        const result = await response.json();
        
        if (result.success) {
          setStatus('success');
          
          // Clear stored payment data
          localStorage.removeItem('paymentReference');
          localStorage.removeItem('paymentPlan');
          
          // Update local user data
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            user.subscriptionTier = result.plan;
            user.promptsUsed = 0;
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          // Redirect to success page
          setTimeout(() => {
            navigate('/user-dashboard', { 
              state: { 
                message: `Welcome to ${result.plan} plan!`,
                plan: result.plan
              }
            });
          }, 3000);
          
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center">
                <div className="loading" style={{ width: '32px', height: '32px' }}></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-4">Verifying Payment</h2>
            <p className="text-stone">Please wait while we confirm your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-gradient-emerald rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-4">Payment Successful!</h2>
            <p className="text-stone mb-6">Your subscription has been activated successfully.</p>
            <p className="text-sm text-stone">Redirecting to your dashboard...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-error rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-4">Payment Failed</h2>
            <p className="text-stone mb-6">Your payment could not be processed. Please try again.</p>
            <button 
              onClick={() => navigate('/subscription')} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-warning rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-4">Verification Error</h2>
            <p className="text-stone mb-6">There was an issue verifying your payment. Please contact support.</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-outline"
            >
              Go Home
            </button>
          </>
        )}
        
        {status === 'invalid' && (
          <>
            <div className="w-20 h-20 bg-cloud rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-stone">❓</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-4">Invalid Payment Reference</h2>
            <p className="text-stone mb-6">Unable to find payment information. Please start over.</p>
            <button 
              onClick={() => navigate('/subscription')} 
              className="btn btn-primary"
            >
              Start Over
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentCallback;