const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    },
  description: String
});

module.exports = mongoose.model('Organization', organizationSchema);