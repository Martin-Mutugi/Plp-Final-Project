const express = require('express');
const Paystack = require('paystack-node');
const User = require('../models/User');
const router = express.Router();

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// Initialize subscription payment
router.post('/initialize', async (req, res) => {
  try {
    const { userId, plan, billingPeriod = 'monthly' } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Define subscription plans with pricing
    const plans = {
      premium: { 
        monthly: { amount: 5000, name: 'Premium Monthly' }, // ₦50.00
        yearly: { amount: 50000, name: 'Premium Yearly' }   // ₦500.00 (save ₦100)
      },
      pro: { 
        monthly: { amount: 15000, name: 'Pro Premium Monthly' }, // ₦150.00
        yearly: { amount: 150000, name: 'Pro Premium Yearly' }   // ₦1,500.00 (save ₦300)
      }
    };

    const selectedPlan = plans[plan]?.[billingPeriod];
    if (!selectedPlan) {
      return res.status(400).json({ error: 'Invalid plan or billing period selected' });
    }

    console.log('Initializing payment for:', user.email, 'Plan:', plan, 'Billing:', billingPeriod, 'Amount:', selectedPlan.amount);

    // Use your actual Vercel URL
    const frontendBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://finale-plp-project-chi.vercel.app'
      : 'http://localhost:3000';

    const callbackUrl = `${frontendBaseUrl}/payment-callback`;

    // Initialize payment with Paystack
    const response = await paystack.initializeTransaction({
      amount: selectedPlan.amount,
      email: user.email,
      metadata: {
        userId: userId,
        plan: plan,
        billingPeriod: billingPeriod,
        custom_fields: [
          {
            display_name: "Plan Type",
            variable_name: "plan_type",
            value: selectedPlan.name
          },
          {
            display_name: "Billing Period", 
            variable_name: "billing_period",
            value: billingPeriod
          }
        ]
      },
      callback_url: callbackUrl
    });

    console.log('Paystack response status:', response.body.status);
    console.log('Paystack response message:', response.body.message);

    if (response.body.status === true) {
      res.json({
        authorization_url: response.body.data.authorization_url,
        access_code: response.body.data.access_code,
        reference: response.body.data.reference
      });
    } else {
      console.error('Paystack API error:', response.body);
      res.status(400).json({ error: response.body.message || 'Payment initialization failed' });
    }

  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed: ' + error.message });
  }
});

// Webhook endpoint for Paystack to send payment verification
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    
    if (event.event === 'charge.success') {
      const data = event.data;
      const metadata = data.metadata;
      
      const userId = metadata.userId;
      const plan = metadata.plan;
      const billingPeriod = metadata.billingPeriod;

      console.log('Webhook: Payment successful for user:', userId, 'Plan:', plan, 'Billing:', billingPeriod);

      // Update user's subscription
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: plan,
        billingPeriod: billingPeriod,
        promptsUsed: 0, // Reset prompt count for premium users
        subscriptionActive: true,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: billingPeriod === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  // 1 month
      });

      console.log('Webhook: User subscription updated successfully');
      
      return res.status(200).json({ status: 'success' });
    }

    res.status(200).json({ status: 'event_not_handled' });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle payment verification via redirect (for frontend callback)
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await paystack.verifyTransaction({ reference });
    
    if (response.body.data.status === 'success') {
      const metadata = response.body.data.metadata;
      const userId = metadata.userId;
      const plan = metadata.plan;
      const billingPeriod = metadata.billingPeriod;

      console.log('Payment verification successful for user:', userId, 'Plan:', plan);

      // Update user's subscription
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: plan,
        billingPeriod: billingPeriod,
        promptsUsed: 0,
        subscriptionActive: true,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: billingPeriod === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      // Redirect to your Vercel app with success message
      res.redirect(`https://finale-plp-project-chi.vercel.app/payment-success?userId=${userId}&plan=${plan}`);
      
    } else {
      res.redirect('https://finale-plp-project-chi.vercel.app/payment-failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.redirect('https://finale-plp-project-chi.vercel.app/payment-error');
  }
});

// Simple verification endpoint that returns JSON (for frontend to handle redirect)
router.get('/verify-json/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await paystack.verifyTransaction({ reference });
    
    if (response.body.data.status === 'success') {
      const metadata = response.body.data.metadata;
      const userId = metadata.userId;
      const plan = metadata.plan;
      const billingPeriod = metadata.billingPeriod;

      console.log('Payment verification successful for user:', userId, 'Plan:', plan);

      // Update user's subscription
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: plan,
        billingPeriod: billingPeriod,
        promptsUsed: 0,
        subscriptionActive: true,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: billingPeriod === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      res.json({
        success: true,
        userId: userId,
        plan: plan,
        billingPeriod: billingPeriod,
        redirectUrl: `https://finale-plp-project-chi.vercel.app/payment-success?userId=${userId}&plan=${plan}`
      });
      
    } else {
      res.json({
        success: false,
        redirectUrl: 'https://finale-plp-project-chi.vercel.app/payment-failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.json({
      success: false,
      error: error.message,
      redirectUrl: 'https://finale-plp-project-chi.vercel.app/payment-error'
    });
  }
});

// Get user's current subscription status
router.get('/status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      subscriptionTier: user.subscriptionTier,
      billingPeriod: user.billingPeriod,
      subscriptionActive: user.subscriptionActive,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      promptsUsed: user.promptsUsed
    });
    
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

module.exports = router;