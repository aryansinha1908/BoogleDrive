const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [3, 'Username must be atleast 3 characters long']
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minlength: [13, 'Email must be of atleast 13 characters long']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Password must be atleast 3 characters long']
    }
})

const user = mongoose.model('user', userSchema)

module.exports = user;
