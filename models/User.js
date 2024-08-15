const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
        },
        mobile: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        adharCardNumber: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'voter'],
            default: 'voter'
        },
        isVoted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compare Password Middleware
userSchema.pre('save', async function (next) {

    const user = this;

    // Hash the password only if it has been modified or is new
    if (!user.isModified('password')) return next();

    try {
        // Generate Salt
        const saltRounds = 10;  // Set the number of salt rounds
        const salt = await bcrypt.genSalt(saltRounds);  // Pass the number of rounds

        // Hash Password
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Override the plain password with hashed one
        user.password = hashedPassword;
        next();
    }
    catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

// Create User Model
const User = mongoose.model('User', userSchema);
module.exports = User;
