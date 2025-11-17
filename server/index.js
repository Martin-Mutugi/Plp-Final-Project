const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/farmer', require('./routes/farmer'));
app.use('/api/consumer', require('./routes/consumer'));
app.use('/api/premium', require('./routes/premium'));

app.get('/', (req, res) => {
  res.send('Hello from the Sustainable Agriculture Server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});