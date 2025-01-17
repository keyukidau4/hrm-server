import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        dayOfBirth: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            required: true,
        },
        sex: {
            type: String,
            required: true,
            enum: ['男', '女'],
        },
        position: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
export const UserModel = mongoose.model('users', userSchema);
