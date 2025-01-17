"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    feedback: {
        type: String,
        default: '',
    },
    reportYearMonthDay: {
        type: String,
        required: true,
    },
    confirmedUserEmail: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.ReportModel = mongoose_1.default.model('reports', reportSchema);
//# sourceMappingURL=reports.js.map