const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Enter your name, an email and a password of at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'That email is already registered. Sign in instead.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user._id), user: pub(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: sign(user._id), user: pub(user) });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Please sign in again' });
    res.json(pub(user));
  } catch (e) { next(e); }
});

module.exports = router;
