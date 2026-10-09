require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

// Basic abuse protection: the AI routes spend Gemini quota, so they get a tighter limit.
const limiter = (max) => rateLimit({ windowMs: 15 * 60 * 1000, max, standardHeaders: true, legacyHeaders: false,
  message: { message: 'Too many requests. Try again in a few minutes.' } });

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', limiter(50), require('./routes/auth'));
app.use('/api/ai', limiter(40), require('./routes/ai'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));
