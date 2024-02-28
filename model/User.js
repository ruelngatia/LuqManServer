// model/User.js
import mongoose from "mongoose";
import crypto from 'crypto'

const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        unique: false
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /.+\@.+\..+/,
        unique: false
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationHash: {
        type: String,
        default: ''
    },
    loginVerificationCode: {
        type: String,
        default: ''
    },
    plan: {
        type: String,
        required: true,
        default: 'free'
    },
    project: {
        type: String,
        required: true,
    },
    requests: {
        type: Number,
        default: 0
    },
    role: {
        type: String
    }
},
);
UserSchema.index({ username: 1, project: 1 }, { unique: true });
UserSchema.index({ email: 1, project: 1 }, { unique: true });


UserSchema.methods.generateVerificationHash = function () {
    this.verificationHash = crypto.randomBytes(64).toString('hex');
};

const User = mongoose.model('User', UserSchema)

export default User
