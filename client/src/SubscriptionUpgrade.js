import React, { useState } from 'react';
import './App.css';

function SubscriptionUpgrade({ user, setUser }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = {
    premium: {
      name: 'Premium',
      monthlyPrice: '₦50',
      yearlyPrice: '₦500',
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
      yearlyPrice: '₦1,500',
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
      <div className="text-center mb-12 fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🚀</span>
          </div>
        </div>
        <h1 className="mb-4">Upgrade Your Sustainable Agriculture Experience</h1>
        <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
          Choose the perfect plan to unlock advanced tools and maximize your environmental impact. 
          All plans include our core SDG tracking features.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <span className={`font-semibold text-lg ${billingPeriod === 'monthly' ? 'text-charcoal' : 'text-stone'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-cloud rounded-full transition-all hover:scale-105"
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${
                billingPeriod === 'yearly' ? 'transform translate-x-8' : 'transform translate-x-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-lg ${billingPeriod === 'yearly' ? 'text-charcoal' : 'text-stone'}`}>
              Yearly Billing
            </span>
            {billingPeriod === 'yearly' && (
              <span className="bg-gradient-to-r from-sun to-earth text-white text-sm px-3 py-1 rounded-full font-semibold">
                Save up to 17%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-2 gap-8 max-w-5xl mx-auto mb-16 stagger">
        {Object.entries(plans).map(([planKey, plan]) => {
          const savings = getSavings(plan);
          const isCurrentPlan = user.subscriptionTier === planKey;
          
          return (
            <div 
              key={planKey}
              className={`relative card-elevated transition-all duration-300 overflow-hidden ${
                selectedPlan === planKey 
                  ? 'ring-4 ring-emerald ring-opacity-50 transform scale-105' 
                  : 'hover:transform hover:scale-102'
              } ${plan.popular ? 'border-2 border-purple-300 shadow-xl' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🏆 MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-emerald to-teal'
                    }`}>
                      <span className="text-2xl text-white">{plan.popular ? '🚀' : '⭐'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-charcoal mb-3">{plan.name}</h3>
                  
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-4xl font-bold text-charcoal">
                      {getCurrentPrice(plan)}
                    </span>
                    <span className="text-lg text-stone">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  
                  {/* Savings Badge */}
                  {billingPeriod === 'yearly' && savings > 0 && (
                    <div className="inline-flex items-center gap-1 bg-success-light text-success px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      <span>💰</span>
                      <span>Save {savings}% vs monthly</span>
                    </div>
                  )}

                  {/* Equivalent Monthly for Yearly */}
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-stone">
                      Equivalent to ₦{Math.round(parseInt(plan.yearlyPrice.replace('₦', '').replace(',', '')) / 12)}/month
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-snow rounded-xl">
                      <span className="text-xl text-emerald flex-shrink-0">{feature.icon}</span>
                      <span className="text-sm text-charcoal leading-relaxed font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={() => {
                    setSelectedPlan(planKey);
                    handleUpgrade(planKey);
                  }}
                  disabled={isProcessing || isCurrentPlan}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all btn-lg ${
                    plan.popular ? 'btn-premium' : 'btn-primary'
                  } ${isCurrentPlan ? 'btn-outline' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : isCurrentPlan ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>✓</span>
                      <span>Current Plan</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>⚡</span>
                      <span>Upgrade to {plan.name}</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Gradient Bottom Border */}
              <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="max-w-4xl mx-auto mb-16 fade-in">
        <div className="card-elevated">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-charcoal mb-2">Plan Comparison</h3>
            <p className="text-stone">See how our plans stack up against each other</p>
          </div>
          
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cloud">
                  <th className="text-left py-4 px-6 font-semibold text-charcoal text-lg">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-stone">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-emerald">Premium</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Prompts', free: '6 per month', premium: 'Unlimited', pro: 'Unlimited' },
                  { feature: 'Farmer Tools', free: 'Basic', premium: 'Advanced', pro: 'Advanced + AI' },
                  { feature: 'Climate Forecast', free: '-', premium: '-', pro: '✓ Advanced' },
                  { feature: 'Supply Chain', free: '-', premium: '-', pro: '✓ Optimized' },
                  { feature: 'Support', free: 'Community', premium: 'Standard', pro: '24/7 Priority' },
                  { feature: 'SDG Reports', free: 'Basic', premium: 'Standard', pro: 'Advanced + Export' },
                  { feature: 'Multi-language', free: '-', premium: '-', pro: '✓ Available' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-cloud hover:bg-snow transition-colors">
                    <td className="py-4 px-6 font-medium text-charcoal">{row.feature}</td>
                    <td className="text-center py-4 px-6 text-stone">{row.free}</td>
                    <td className="text-center py-4 px-6 text-success font-semibold">{row.premium}</td>
                    <td className="text-center py-4 px-6 text-purple-600 font-semibold">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="text-center mb-12 fade-in">
        <div className="inline-flex items-center gap-8 bg-snow rounded-2xl p-6 border border-cloud">
          {[
            { icon: '🔒', text: 'Secure Payment' },
            { icon: '↶', text: 'Cancel Anytime' },
            { icon: '✓', text: 'Money-back Guarantee' },
            { icon: '🌍', text: 'SDG Impact' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl text-emerald">{item.icon}</span>
              <span className="font-semibold text-charcoal">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-12 fade-in">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-charcoal mb-2">Frequently Asked Questions</h3>
          <p className="text-stone">Get answers to common questions about our subscription plans</p>
        </div>
        
        <div className="grid gap-4">
          {[
            {
              question: 'Can I change plans later?',
              answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            },
            {
              question: 'Is there a free trial?',
              answer: 'All paid plans include a 7-day free trial. You can cancel anytime during the trial period.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, bank transfers, and mobile money through our secure payment partner Paystack.'
            },
            {
              question: 'How does the SDG impact work?',
              answer: 'A portion of every subscription goes towards sustainable agriculture initiatives that support UN Sustainable Development Goals.'
            }
          ].map((faq, index) => (
            <div key={index} className="card card-interactive">
              <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-3">
                <span className="text-emerald">❓</span>
                {faq.question}
              </h4>
              <p className="text-sm text-stone leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SDG Impact Message */}
      <div className="text-center fade-in">
        <div className="card bg-gradient-emerald text-white">
          <div className="flex justify-center mb-4">
            <span className="text-4xl">🌍</span>
          </div>
          <h4 className="text-xl font-semibold mb-3">Your Subscription Supports Sustainable Development</h4>
          <p className="opacity-90 leading-relaxed max-w-2xl mx-auto">
            A portion of every subscription goes towards sustainable agriculture initiatives 
            that directly support UN Sustainable Development Goals 2 (Zero Hunger), 12 (Responsible Consumption), and 13 (Climate Action).
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionUpgrade;