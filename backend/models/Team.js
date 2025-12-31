const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
  },
  teamName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  teamCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  leaderId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Note: teamCode already has unique: true which creates an index automatically
// No need for separate teamSchema.index({ teamCode: 1 }) - that causes duplicate warning

module.exports = mongoose.model('Team', teamSchema);
