const mongoose = require('mongoose');

const OKRSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  keyResults: [
    {
      type: String,
      required: true
    }
  ],
  progress: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OKR', OKRSchema);