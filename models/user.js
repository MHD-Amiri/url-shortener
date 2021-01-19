const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['blogger', 'admin'],
        default: 'blogger'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);