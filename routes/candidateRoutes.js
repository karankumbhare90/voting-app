const express = require('express');
const router = express.Router();
const { generateToken, jwtAuthMiddleWare } = require('../jsonWebToken');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// Check the admin
const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user.role === 'admin') {
            return true;
        }
    } catch (err) {
        return false;
    }
}

// User Signup, POST
router.post('/', jwtAuthMiddleWare, async (req, res) => {
    try {

        // Check for the admin
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User has not have admin Role' });
        }

        // User Data
        // Assuming req.body contain the Candidate data
        const data = req.body;

        // Create a new User Document using mongoose model
        const newCandidate = new Candidate(data);

        // Save the newUser data into database
        const response = await newCandidate.save();
        console.log('Candidate Data Saved');

        res.status(200).json({ response: response });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Update Candidate Data - PUT
router.put('/:candidateId', jwtAuthMiddleWare, async (req, res) => {
    try {

        // Check for the admin
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User has not have admin Role' });
        }

        // Extract iser id from the token
        const candidateId = req.params.candidateId;

        // Update data for the person
        const updatedCandidateData = req.body;

        // Find the user By Id
        const response = await User.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true,
            runValidators: true
        });

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        console.log("Candidate Data Updated");
        res.status(200).json({ response, message: "Candidate data Updated" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})


// Delete Candidate Data - PUT
router.delete('/:candidateId', jwtAuthMiddleWare, async (req, res) => {
    try {

        // Check for the admin
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User has not have admin Role' });
        }

        // Extract iser id from the token
        const candidateId = req.params.candidateId;

        // Find the user By Id
        const response = await User.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        console.log("Candidate Deleted");
        res.status(200).json({ response });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})


// Voting
router.post('/vote/:candidateID', jwtAuthMiddleWare, async (req, res) => {
    // No admin can vote & user can vote only once

    const candidateID = req.params.candidateID;
    const userID = req.user.id;
    try {
        // Find the candidate document with the specified candidate ID
        const candidate = await Candidate.findById(candidateID);

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVoted) {
            return res.status(400).json({ message: "You've already voted." });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admin is not allowed to vote" });
        }

        // Update the candidate document to record the vote
        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        return res.status(200).json({ message: "Vote Recorded Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/vote/count', async (req, res) => {
    try {
        // Find all the candidate and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        // Return candidate name and the votecount
        const votRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount,
            }
        })

        return res.status(200).json(votRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/candidate', async (req, res) => {
    try {
        const candidate = await Candidate.find();

        if (!candidate) {
            return res.status(404).json({ message: "Candidate's not found" });
        }

        return res.status(200).json(candidate);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;