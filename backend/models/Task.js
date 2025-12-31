const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  ownerId: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  teamId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for quick lookup by teamId
taskSchema.index({ teamId: 1 });

// Index for quick lookup by ownerId
taskSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Task', taskSchema);
