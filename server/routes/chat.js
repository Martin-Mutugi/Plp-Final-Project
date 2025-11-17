const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Chat = require('../models/Chat');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/message', async (req, res) => {
  try {
    const { userId, message, sessionId, language = 'english' } = req.body;

    // Find user and check prompt limit
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check free user prompt limit
    if (user.subscriptionTier === 'free' && user.promptsUsed >= 6) {
      return res.status(403).json({ 
        error: 'Free prompt limit reached. Please upgrade to continue.',
        upgradeRequired: true 
      });
    }

    // Check if multilingual is a premium feature
    if (language !== 'english' && user.subscriptionTier === 'free') {
      return res.status(403).json({ 
        error: 'Multilingual support is available for Premium users only. Please upgrade.',
        upgradeRequired: true 
      });
    }

    // Get AI response with language support
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    const prompt = `You are an expert in sustainable agriculture. Answer this question helpfully and concisely in ${language}: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiReply = response.text();

    // Save chat to database
    const newChat = new Chat({
      userId,
      sessionId: sessionId || 'default-session',
      message,
      response: aiReply,
      language: language
    });
    await newChat.save();

    // Update user's prompt count
    user.promptsUsed += 1;
    await user.save();

    res.json({ 
      reply: aiReply,
      promptsUsed: user.promptsUsed,
      subscriptionTier: user.subscriptionTier,
      language: language
    });

  } catch (error) {
    res.status(500).json({ error: 'AI service error', details: error.message });
  }
});

// Get user's chat history (individual messages for a session)
router.get('/history/:userId/:sessionId', async (req, res) => {
  try {
    const chats = await Chat.find({ 
      userId: req.params.userId,
      sessionId: req.params.sessionId 
    }).sort({ timestamp: 1 }); // Oldest first for conversation flow
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get user's chat sessions (grouped by sessionId)
router.get('/sessions/:userId', async (req, res) => {
  try {
    const sessions = await Chat.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$message' },
          lastTimestamp: { $first: '$timestamp' },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

module.exports = router;