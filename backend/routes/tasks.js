const express = require('express');
const { nanoid } = require('nanoid');
const Task = require('../models/Task');
const Team = require('../models/Team');
const Member = require('../models/Member');

const router = express.Router();

// GET /tasks/:teamId - Get all tasks for a team
router.get('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify team exists
    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get all tasks sorted by deadline
    const tasks = await Task.find({ teamId }).sort({ deadline: 1 });

    res.status(200).json(
      tasks.map((t) => ({
        _id: t._id,
        taskId: t.taskId,
        title: t.title,
        ownerId: t.ownerId,
        deadline: t.deadline,
        status: t.status,
        teamId: t.teamId,
      }))
    );
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// POST /tasks - Create a new task (leader only)
router.post('/', async (req, res) => {
  try {
    const { title, ownerId, deadline, teamId, leaderId } = req.body;

    // Validate input
    if (!title || !ownerId || !deadline || !teamId || !leaderId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }

    // Verify team exists
    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify requester is the leader
    if (team.leaderId !== leaderId) {
      return res.status(403).json({ message: 'Only the team leader can create tasks' });
    }

    // Verify owner is a member of the team
    const owner = await Member.findOne({ memberId: ownerId, teamId });
    if (!owner) {
      return res.status(400).json({ message: 'Owner must be a member of this team' });
    }

    // Create task
    const task = new Task({
      taskId: nanoid(),
      title: title.trim(),
      ownerId,
      deadline: new Date(deadline),
      status: 'Not Started',
      teamId,
    });

    await task.save();

    res.status(201).json({
      _id: task._id,
      taskId: task.taskId,
      title: task.title,
      ownerId: task.ownerId,
      deadline: task.deadline,
      status: task.status,
      teamId: task.teamId,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// PATCH /tasks/:id - Update task status (owner only)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, memberId } = req.body;

    // Validate input
    if (!status || !memberId) {
      return res.status(400).json({ message: 'Status and memberId are required' });
    }

    const validStatuses = ['Not Started', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find task
    const task = await Task.findOne({ taskId: id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify requester is the task owner
    if (task.ownerId !== memberId) {
      return res.status(403).json({ message: 'Only the task owner can update its status' });
    }

    // Update status
    task.status = status;
    await task.save();

    res.status(200).json({
      _id: task._id,
      taskId: task.taskId,
      title: task.title,
      ownerId: task.ownerId,
      deadline: task.deadline,
      status: task.status,
      teamId: task.teamId,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

module.exports = router;
