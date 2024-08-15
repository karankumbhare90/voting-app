const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        party: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
        },
        votes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                voted: {
                    type: Date,
                    default: Date.now()
                }
            }
        ],

        voteCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)


const Candidate = mongoose.model('Candidates', candidateSchema);
module.exports = Candidate;