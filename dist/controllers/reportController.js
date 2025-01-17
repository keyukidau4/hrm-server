"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeedbackReportController = exports.changeStatusReportController = exports.getListReportbyAdminController = exports.updateReportController = exports.getSingleReportController = exports.getListReportController = exports.addNewReport = void 0;
const api_1 = require("../helpers/api");
const reports_1 = require("../models/reports");
const checkRequest_1 = require("../helpers/checkRequest");
//add new report
const addNewReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, reportYearMonthDay } = req.body;
        const request = req;
        const reqEmail = request.email;
        const addData = {
            userEmail: reqEmail,
            title,
            content,
            status: 'pending',
            reportYearMonthDay,
        };
        const resultQuery = yield new reports_1.ReportModel(addData).save();
        if (!resultQuery) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Add Report Failed!' });
        }
        const resultData = resultQuery.toObject();
        return (0, api_1.sendSuccessMessage)(res, resultData, 'Add New Report Success!');
    }
    catch (error) {
        console.error('error at addNewReport ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.addNewReport = addNewReport;
//get Report By Email
const getListReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const request = req;
        const reqEmail = request.email;
        let resultList;
        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = (0, checkRequest_1.checkIsValidStatus)(status);
            if (!checkStatus) {
                return (0, api_1.sendErrorMessage)(res, 400, { message: 'Status Is Not Invalid' });
            }
            resultList = yield reports_1.ReportModel.find({ userEmail: reqEmail, status }).exec();
        }
        else {
            resultList = yield reports_1.ReportModel.find({ userEmail: reqEmail }).exec();
        }
        if (!resultList) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'No Data To Get' });
        }
        return (0, api_1.sendSuccessMessage)(res, resultList, 'get List Reporst Success!');
    }
    catch (error) {
        console.error('error at getListReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.getListReportController = getListReportController;
//get Report By Email
const getSingleReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const request = req;
        const reqEmail = request.email;
        const resultData = yield reports_1.ReportModel.findOne({ userEmail: reqEmail, _id: id }).exec();
        if (!resultData) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'No Data To Get' });
        }
        return (0, api_1.sendSuccessMessage)(res, resultData, 'get Report Success!');
    }
    catch (error) {
        console.error('error at getSingleReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.getSingleReportController = getSingleReportController;
const updateReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, title, content } = req.body;
        const request = req;
        const reqEmail = request.email;
        const checkExistReport = yield reports_1.ReportModel.findOne({ _id, userEmail: reqEmail });
        if (!checkExistReport) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'This report Is Not Invalid' });
        }
        const updateData = yield reports_1.ReportModel.findByIdAndUpdate(_id, {
            title,
            content,
            status: 'pending',
        });
        if (!updateData) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Update Report Failed!' });
        }
        return (0, api_1.sendSuccessMessage)(res, updateData, 'Update Report Success!');
    }
    catch (error) {
        console.error('error at updateReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.updateReportController = updateReportController;
//get Report By Email
const getListReportbyAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, yearMonth } = req.query;
        let resultList;
        const match = {};
        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = (0, checkRequest_1.checkIsValidStatus)(status);
            if (!checkStatus) {
                return (0, api_1.sendErrorMessage)(res, 500, { message: 'Status Is Not Invalid' });
            }
            match['status'] = status;
        }
        if (yearMonth && typeof yearMonth == 'string' && yearMonth.length > 1) {
            match['reportYearMonthDay'] = yearMonth;
        }
        if ((status && typeof status == 'string' && status.length > 1) ||
            (yearMonth && typeof yearMonth == 'string' && yearMonth.length > 1)) {
            resultList = yield reports_1.ReportModel.aggregate([
                {
                    $match: match,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userEmail',
                        foreignField: 'email',
                        as: 'userInfo',
                    },
                },
                {
                    $unwind: '$userInfo',
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        status: 1,
                        feedback: 1,
                        reportYearMonthDay: 1,
                        'userInfo.firstName': 1,
                        'userInfo.lastName': 1,
                        'userInfo.email': 1,
                        'userInfo.position': 1,
                    },
                },
            ]);
        }
        else {
            resultList = yield reports_1.ReportModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userEmail',
                        foreignField: 'email',
                        as: 'userInfo',
                    },
                },
                {
                    $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        status: 1,
                        feedback: 1,
                        reportYearMonthDay: 1,
                        'userInfo.firstName': 1,
                        'userInfo.lastName': 1,
                        'userInfo.email': 1,
                        'userInfo.position': 1,
                    },
                },
            ]);
        }
        if (!resultList) {
            return (0, api_1.sendErrorMessage)(res, 500, { message: 'No Data To Get' });
        }
        return (0, api_1.sendSuccessMessage)(res, resultList, 'get List Reporst Success!');
    }
    catch (error) {
        console.error('error at getListReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.getListReportbyAdminController = getListReportbyAdminController;
//change status
const changeStatusReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, status } = req.body;
        const checkExistReport = yield reports_1.ReportModel.findOne({ _id, status: 'pending' });
        if (!checkExistReport) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'This report Is Not Invalid' });
        }
        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = (0, checkRequest_1.checkIsValidStatus)(status);
            if (!checkStatus) {
                return (0, api_1.sendErrorMessage)(res, 400, { message: 'Status Is Not Invalid' });
            }
            const changeStatus = yield reports_1.ReportModel.findByIdAndUpdate(_id, { status });
            if (!changeStatus) {
                return (0, api_1.sendErrorMessage)(res, 400, { message: 'Status update rr' });
            }
            return (0, api_1.sendSuccessMessage)(res, changeStatus, 'get List Reporst Success!');
        }
        else {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Status Is Not Invalid' });
        }
    }
    catch (error) {
        console.error('error at getListReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.changeStatusReportController = changeStatusReportController;
//change status
const addFeedbackReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, feedback } = req.body;
        const checkExistReport = yield reports_1.ReportModel.findOne({ _id, status: 'pending' });
        if (!checkExistReport) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'This report Is Not Invalid' });
        }
        const customRequest = req;
        //
        const changeStatus = yield reports_1.ReportModel.findByIdAndUpdate(_id, {
            status: 'rejected',
            feedback,
            confirmedUserEmail: customRequest.email,
        });
        if (!changeStatus) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Status update Error' });
        }
        return (0, api_1.sendSuccessMessage)(res, changeStatus, 'Add Reporst Feed Success!');
    }
    catch (error) {
        console.error('error at getListReportController ', error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.addFeedbackReportController = addFeedbackReportController;
//# sourceMappingURL=reportController.js.map