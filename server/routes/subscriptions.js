const express = require('express');
const Paystack = require('paystack-node');
const User = require('../models/User');
const router = express.Router();

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// Initialize subscription payment
router.post('/initialize', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Define subscription plans
    const plans = {
      premium: { amount: 5000, name: 'Premium' }, // 5000 = 5000 NGN (₦50.00)
      pro: { amount: 15000, name: 'Pro Premium' } // 15000 = 15000 NGN (₦150.00)
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    console.log('Initializing payment for:', user.email, 'Plan:', plan, 'Amount:', selectedPlan.amount);
    console.log('Paystack Secret Key exists:', !!process.env.PAYSTACK_SECRET_KEY);

    // Initialize payment with Paystack
    const response = await paystack.initializeTransaction({
      amount: selectedPlan.amount,
      email: user.email,
      metadata: JSON.stringify({
        userId: userId,
        plan: plan
      }),
      callback_url: 'http://localhost:5000/api/subscriptions/verify'
    });

    console.log('Paystack response status:', response.body.status);
    console.log('Paystack response message:', response.body.message);

    if (response.body.status === true) {
      res.json({
        authorization_url: response.body.data.authorization_url,
        access_code: response.body.data.access_code
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

// Verify payment and update user subscription
router.get('/verify', async (req, res) => {
  try {
    const response = await paystack.verifyTransaction({ reference: req.query.reference });
    
    if (response.body.data.status === 'success') {
      const metadata = response.body.data.metadata;
      const userId = metadata.userId;
      const plan = metadata.plan;

      // Update user's subscription
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: plan,
        promptsUsed: 0 // Reset prompt count for premium users
      });

      res.redirect(`http://localhost:3000?payment=success&userId=${userId}`);
    } else {
      res.redirect('http://localhost:3000?payment=failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.redirect('http://localhost:3000?payment=error');
  }
});

module.exports = router;