const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true }
});

module.exports = mongoose.model('Team', teamSchema);