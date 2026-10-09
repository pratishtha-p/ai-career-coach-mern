const mongoose = require('mongoose');
module.exports = mongoose.model('Analysis', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['resume', 'interview', 'roadmap'], required: true },
  title: String,
  input: mongoose.Schema.Types.Mixed,
  result: mongoose.Schema.Types.Mixed
}, { timestamps: true }));
