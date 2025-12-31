const express = require('express');
const { nanoid } = require('nanoid');
const Team = require('../models/Team');
const Member = require('../models/Member');

const router = express.Router();

// Generate a unique 6-character team code
const generateTeamCode = () => {
  return nanoid(6).toUpperCase();
};

// POST /team/create - Create a new team
router.post('/create', async (req, res) => {
  try {
    const { teamName, leaderName } = req.body;

    // Validate input
    if (!teamName || !leaderName) {
      return res.status(400).json({ message: 'Team name and leader name are required' });
    }

    if (teamName.length > 100) {
      return res.status(400).json({ message: 'Team name must be 100 characters or less' });
    }

    if (leaderName.length > 50) {
      return res.status(400).json({ message: 'Leader name must be 50 characters or less' });
    }

    // Generate unique IDs
    const teamId = nanoid();
    const memberId = nanoid();
    let teamCode = generateTeamCode();

    // Ensure team code is unique (retry if collision)
    let attempts = 0;
    while (await Team.findOne({ teamCode }) && attempts < 5) {
      teamCode = generateTeamCode();
      attempts++;
    }

    // Create team with leader as leaderId
    const team = new Team({
      teamId,
      teamName: teamName.trim(),
      teamCode,
      leaderId: memberId,
    });

    // Create leader as first member
    const member = new Member({
      memberId,
      name: leaderName.trim(),
      teamId,
    });

    // Save both
    await team.save();
    await member.save();

    res.status(201).json({
      team: {
        _id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        teamCode: team.teamCode,
        leaderId: team.leaderId,
      },
      member: {
        _id: member._id,
        memberId: member.memberId,
        name: member.name,
        teamId: member.teamId,
      },
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// POST /team/join - Join a team (also acts as login)
router.post('/join', async (req, res) => {
  try {
    const { memberName, teamCode } = req.body;

    // Validate input
    if (!memberName || !teamCode) {
      return res.status(400).json({ message: 'Member name and team code are required' });
    }

    if (memberName.length > 50) {
      return res.status(400).json({ message: 'Member name must be 50 characters or less' });
    }

    // Find team by code
    const team = await Team.findOne({ teamCode: teamCode.toUpperCase() });
    if (!team) {
      return res.status(404).json({ message: 'Team not found. Check your team code.' });
    }

    // Check if member already exists in this team
    let member = await Member.findOne({
      name: { $regex: new RegExp(`^${memberName.trim()}$`, 'i') },
      teamId: team.teamId,
    });

    let isNewMember = false;

    if (member) {
      // Existing member - just return their data (login)
      console.log(`Existing member logged in: ${member.name}`);
    } else {
      // New member - create them
      member = new Member({
        memberId: nanoid(),
        name: memberName.trim(),
        teamId: team.teamId,
      });
      await member.save();
      isNewMember = true;
      console.log(`New member joined: ${member.name}`);
    }

    res.status(200).json({
      team: {
        _id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        teamCode: team.teamCode,
        leaderId: team.leaderId,
      },
      member: {
        _id: member._id,
        memberId: member.memberId,
        name: member.name,
        teamId: member.teamId,
      },
      isNewMember,
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ message: 'Failed to join team' });
  }
});

module.exports = router;
