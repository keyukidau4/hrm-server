"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.UserModel = mongoose_1.default.model('users', userSchema);
//# sourceMappingURL=users.js.map