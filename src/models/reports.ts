import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    },
);
export const ReportModel = mongoose.model('reports', reportSchema);
