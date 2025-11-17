import React, { useState } from 'react';

function SubscriptionUpgrade({ user, setUser }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or yearly

  const plans = {
    premium: {
      name: 'Premium',
      monthlyPrice: '₦50',
      yearlyPrice: '₦500', // 2 months free
      features: [
        { text: 'Unlimited AI prompts & chatbot access', icon: '🤖' },
        { text: 'Personalized crop planning tools', icon: '🌱' },
        { text: 'Soil health insights & analysis', icon: '🪴' },
        { text: 'Food consumption tracking', icon: '📊' },
        { text: 'Basic carbon footprint calculator', icon: '🌍' },
        { text: 'Regional crop recommendations', icon: '🗺️' },
        { text: 'Standard customer support', icon: '💬' }
      ],
      popular: false,
      gradient: 'from-emerald to-teal'
    },
    pro: {
      name: 'Pro Premium', 
      monthlyPrice: '₦150',
      yearlyPrice: '₦1,500', // 2 months free
      features: [
        { text: 'All Premium features included', icon: '⭐' },
        { text: 'Advanced climate forecasting', icon: '🌤️' },
        { text: 'Supply chain optimization', icon: '🔗' },
        { text: 'Export market insights', icon: '📈' },
        { text: 'Priority 24/7 customer support', icon: '🚨' },
        { text: 'Exclusive sustainability reports', icon: '📋' },
        { text: 'Advanced analytics dashboard', icon: '📊' },
        { text: 'Multi-language AI support', icon: '🌐' },
        { text: 'Emergency agricultural hotline', icon: '🆘' }
      ],
      popular: true,
      gradient: 'from-purple-500 to-pink-500'
    }
  };

  const handleUpgrade = async (plan) => {
    if (!plan) {
      alert('Please select a plan to continue');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscriptions/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          plan: plan,
          billingPeriod: billingPeriod
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        alert('Payment initialization failed: ' + data.error);
      }
    } catch (error) {
      alert('Upgrade error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPrice = (plan) => {
    return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (billingPeriod === 'yearly') {
      const monthlyCost = parseInt(plan.monthlyPrice.replace('₦', ''));
      const yearlyCost = parseInt(plan.yearlyPrice.replace('₦', '').replace(',', ''));
      const monthlyEquivalent = yearlyCost / 12;
      return Math.round(((monthlyCost - monthlyEquivalent) / monthlyCost) * 100);
    }
    return 0;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <h1>Upgrade Your Sustainable Agriculture Experience</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto">
          Choose the perfect plan to unlock advanced tools and maximize your environmental impact. 
          All plans include our core SDG tracking features.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-charcoal' : 'text-stone'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-cloud rounded-full transition-colors"
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                billingPeriod === 'yearly' ? 'transform translate-x-7' : 'transform translate-x-1'
              }`}
            />
          </button>
          <span className={`font-medium ${billingPeriod === 'yearly' ? 'text-charcoal' : 'text-stone'}`}>
            Yearly
            {billingPeriod === 'yearly' && (
              <span className="ml-2 bg-warning text-charcoal text-xs px-2 py-1 rounded-full">
                Save up to 17%
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-2 gap-8 max-w-5xl mx-auto">
        {Object.entries(plans).map(([planKey, plan]) => (
          <div 
            key={planKey}
            className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
              selectedPlan === planKey 
                ? 'ring-4 ring-emerald ring-opacity-50 transform scale-105' 
                : 'ring-2 ring-cloud hover:ring-emerald hover:ring-opacity-30 hover:transform hover:scale-102'
            } ${plan.popular ? 'border-2 border-purple-300' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🏆 MOST POPULAR
                </div>
              </div>
            )}

            <div className="bg-white p-8">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-charcoal mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-charcoal">
                    {getCurrentPrice(plan)}
                  </span>
                  <span className="text-stone">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                </div>
                
                {/* Savings Badge */}
                {billingPeriod === 'yearly' && getSavings(plan) > 0 && (
                  <div className="inline-block bg-success bg-opacity-10 text-success px-3 py-1 rounded-full text-sm font-medium">
                    Save {getSavings(plan)}% vs monthly
                  </div>
                )}

                {/* Equivalent Monthly for Yearly */}
                {billingPeriod === 'yearly' && (
                  <p className="text-sm text-stone mt-2">
                    Equivalent to ₦{Math.round(parseInt(plan.yearlyPrice.replace('₦', '').replace(',', '')) / 12)}/month
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-lg text-emerald mt-0.5">{feature.icon}</span>
                    <span className="text-sm text-charcoal leading-relaxed">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Upgrade Button */}
              <button
                onClick={() => {
                  setSelectedPlan(planKey);
                  handleUpgrade(planKey);
                }}
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-r from-emerald to-teal hover:from-emerald-dark hover:to-teal-dark shadow-md hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                    Processing...
                  </div>
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>

              {/* Current Plan Indicator */}
              {user.subscriptionTier === planKey && (
                <div className="text-center mt-3">
                  <span className="bg-cloud text-charcoal px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Your Current Plan
                  </span>
                </div>
              )}
            </div>

            {/* Gradient Bottom Border */}
            <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="card-elevated">
          <h3 className="text-center text-xl font-semibold mb-6">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cloud">
                  <th className="text-left py-3 font-semibold text-charcoal">Feature</th>
                  <th className="text-center py-3 font-semibold text-stone">Free</th>
                  <th className="text-center py-3 font-semibold text-emerald">Premium</th>
                  <th className="text-center py-3 font-semibold text-purple-600">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cloud">
                  <td className="py-3 font-medium">AI Prompts</td>
                  <td className="text-center py-3 text-stone">6 per month</td>
                  <td className="text-center py-3 text-success">Unlimited</td>
                  <td className="text-center py-3 text-success">Unlimited</td>
                </tr>
                <tr className="border-b border-cloud">
                  <td className="py-3 font-medium">Farmer Tools</td>
                  <td className="text-center py-3 text-stone">Basic</td>
                  <td className="text-center py-3 text-success">Advanced</td>
                  <td className="text-center py-3 text-success">Advanced + AI</td>
                </tr>
                <tr className="border-b border-cloud">
                  <td className="py-3 font-medium">Climate Forecast</td>
                  <td className="text-center py-3 text-stone">-</td>
                  <td className="text-center py-3 text-stone">-</td>
                  <td className="text-center py-3 text-success">✓ Advanced</td>
                </tr>
                <tr className="border-b border-cloud">
                  <td className="py-3 font-medium">Supply Chain</td>
                  <td className="text-center py-3 text-stone">-</td>
                  <td className="text-center py-3 text-stone">-</td>
                  <td className="text-center py-3 text-success">✓ Optimized</td>
                </tr>
                <tr className="border-b border-cloud">
                  <td className="py-3 font-medium">Support</td>
                  <td className="text-center py-3 text-stone">Community</td>
                  <td className="text-center py-3 text-success">Standard</td>
                  <td className="text-center py-3 text-success">24/7 Priority</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">SDG Reports</td>
                  <td className="text-center py-3 text-stone">Basic</td>
                  <td className="text-center py-3 text-success">Standard</td>
                  <td className="text-center py-3 text-success">Advanced + Export</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-6 text-sm text-stone">
          <span className="flex items-center gap-2">
            <span className="text-success">🔒</span>
            Secure Payment
          </span>
          <span className="flex items-center gap-2">
            <span className="text-success">↶</span>
            Cancel Anytime
          </span>
          <span className="flex items-center gap-2">
            <span className="text-success">✓</span>
            Money-back Guarantee
          </span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h3 className="text-center text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="grid gap-4">
          <div className="card">
            <h4 className="font-semibold mb-2">Can I change plans later?</h4>
            <p className="text-sm text-stone">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div className="card">
            <h4 className="font-semibold mb-2">Is there a free trial?</h4>
            <p className="text-sm text-stone">
              All paid plans include a 7-day free trial. You can cancel anytime during the trial period.
            </p>
          </div>
          <div className="card">
            <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
            <p className="text-sm text-stone">
              We accept all major credit cards, bank transfers, and mobile money through our secure payment partner Paystack.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Impact Message */}
      <div className="mt-8 card bg-gradient-to-r from-emerald to-teal text-white text-center">
        <h4 className="text-lg font-semibold mb-2">🌍 Your Subscription Supports SDGs</h4>
        <p className="opacity-90">
          A portion of every subscription goes towards sustainable agriculture initiatives 
          that support UN Sustainable Development Goals 2, 12, and 13.
        </p>
      </div>
    </div>
  );
}

export default SubscriptionUpgrade;