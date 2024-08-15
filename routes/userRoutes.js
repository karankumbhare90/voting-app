const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, jwtAuthMiddleWare } = require('../jsonWebToken');


// User Signup, POST
router.post('/signup', async (req, res) => {
    try {
        // User Data
        // const data = req.body; Assuming req.body contain the users data
        const data = req.body;

        // Create a new User Document using mongoose model
        const newUser = new User(data);

        // Save the newUser data into database
        const response = await newUser.save();
        console.log('User Data Saved');

        const payLoad = {
            id: response.id
        }

        console.log(JSON.stringify(payLoad));

        const token = generateToken(payLoad);
        console.log(`Token is : ${token}`);

        res.status(200).json({ response: response, token: token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Login - POST
router.post('/login', async (req, res) => {
    try {
        // Extract aadharCard and password from the request body
        const { adharCardNumber, password } = req.body;

        // Find the user by Adhar Card number
        const user = await User.findOne({ adharCardNumber: adharCardNumber });

        if (!user || !(await User.comparePassword(password))) {
            return res.send(401).json({ error: "Invalid username and password" });
        }

        // Generate Token
        const payLoad = {
            id: user.id
        }

        const token = generateToken(payLoad);

        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Get Profile - GET
router.get('profile', jwtAuthMiddleWare, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Change Password - PUT

router.put('/profile/password', jwtAuthMiddleWare, async (req, res) => {
    try {
        // Extract iser id from the token
        const userid = req.user;

        // Get the current password and new password from the user
        const { currentPassword, newPassword } = req.body;

        // Find the user By Id
        const user = await User.findById(userId);

        // If Password doesn't match return error
        if (!(await User.comparePassword(currentPassword))) {
            return res.send(401).json({ error: "Invalid Password" });
        }

        user.password = newPassword;
        await user.save();

        console.log("Password Updated");
        res.status(200).json({ message: "Password Updated" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;