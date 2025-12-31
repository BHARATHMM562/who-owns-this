const express = require('express');
const Member = require('../models/Member');
const Team = require('../models/Team');

const router = express.Router();

// GET /members/:teamId - Get all members of a team
router.get('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify team exists
    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get all members
    const members = await Member.find({ teamId }).sort({ createdAt: 1 });

    res.status(200).json(
      members.map((m) => ({
        _id: m._id,
        memberId: m.memberId,
        name: m.name,
        teamId: m.teamId,
      }))
    );
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

module.exports = router;
