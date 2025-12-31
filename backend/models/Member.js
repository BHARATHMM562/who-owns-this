const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  teamId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound unique index to prevent duplicate members in the same team
// This ensures the same person can't join the same team twice
memberSchema.index({ name: 1, teamId: 1 }, { unique: true });

// Index for quick lookup by teamId
memberSchema.index({ teamId: 1 });

module.exports = mongoose.model('Member', memberSchema);
