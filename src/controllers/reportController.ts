import { Request, Response } from 'express';
import { sendErrorMessage, sendSuccessMessage } from '../helpers/api';
import { CustomRequest } from '../types/api';
import { ReportModel } from '../models/reports';
import { checkIsValidStatus } from '../helpers/checkRequest';

//add new report
export const addNewReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, reportYearMonthDay } = req.body;
        const request: CustomRequest = req as CustomRequest;

        const reqEmail = request.email;

        const addData = {
            userEmail: reqEmail,
            title,
            content,
            status: 'pending',
            reportYearMonthDay,
        };

        const resultQuery = await new ReportModel(addData).save();

        if (!resultQuery) {
            return sendErrorMessage(res, 400, { message: 'Add Report Failed!' });
        }

        const resultData = resultQuery.toObject();

        return sendSuccessMessage(res, resultData, 'Add New Report Success!');
    } catch (error) {
        console.error('error at addNewReport ', error);

        return sendErrorMessage(res, 500, error);
    }
};

//get Report By Email
export const getListReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.query;

        const request: CustomRequest = req as CustomRequest;

        const reqEmail = request.email;

        let resultList;

        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = checkIsValidStatus(status);

            if (!checkStatus) {
                return sendErrorMessage(res, 400, { message: 'Status Is Not Invalid' });
            }

            resultList = await ReportModel.find({ userEmail: reqEmail, status }).exec();
        } else {
            resultList = await ReportModel.find({ userEmail: reqEmail }).exec();
        }

        if (!resultList) {
            return sendErrorMessage(res, 400, { message: 'No Data To Get' });
        }

        return sendSuccessMessage(res, resultList, 'get List Reporst Success!');
    } catch (error) {
        console.error('error at getListReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};

//get Report By Email
export const getSingleReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;

        const request: CustomRequest = req as CustomRequest;

        const reqEmail = request.email;

        const resultData = await ReportModel.findOne({ userEmail: reqEmail, _id: id }).exec();

        if (!resultData) {
            return sendErrorMessage(res, 400, { message: 'No Data To Get' });
        }

        return sendSuccessMessage(res, resultData, 'get Report Success!');
    } catch (error) {
        console.error('error at getSingleReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};

export const updateReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, title, content } = req.body;

        const request: CustomRequest = req as CustomRequest;

        const reqEmail = request.email;

        const checkExistReport = await ReportModel.findOne({ _id, userEmail: reqEmail });

        if (!checkExistReport) {
            return sendErrorMessage(res, 400, { message: 'This report Is Not Invalid' });
        }

        const updateData = await ReportModel.findByIdAndUpdate(_id, {
            title,
            content,
            status: 'pending',
        });

        if (!updateData) {
            return sendErrorMessage(res, 400, { message: 'Update Report Failed!' });
        }

        return sendSuccessMessage(res, updateData, 'Update Report Success!');
    } catch (error) {
        console.error('error at updateReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};

//get Report By Email
export const getListReportbyAdminController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { status, yearMonth } = req.query;

        let resultList;

        const match: { [key: string]: string } = {};

        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = checkIsValidStatus(status);

            if (!checkStatus) {
                return sendErrorMessage(res, 500, { message: 'Status Is Not Invalid' });
            }
            match['status'] = status;
        }
        if (yearMonth && typeof yearMonth == 'string' && yearMonth.length > 1) {
            match['reportYearMonthDay'] = yearMonth;
        }

        if (
            (status && typeof status == 'string' && status.length > 1) ||
            (yearMonth && typeof yearMonth == 'string' && yearMonth.length > 1)
        ) {
            resultList = await ReportModel.aggregate([
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
        } else {
            resultList = await ReportModel.aggregate([
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
            return sendErrorMessage(res, 500, { message: 'No Data To Get' });
        }

        return sendSuccessMessage(res, resultList, 'get List Reporst Success!');
    } catch (error) {
        console.error('error at getListReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};

//change status
export const changeStatusReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, status } = req.body;

        const checkExistReport = await ReportModel.findOne({ _id, status: 'pending' });

        if (!checkExistReport) {
            return sendErrorMessage(res, 400, { message: 'This report Is Not Invalid' });
        }

        if (status && typeof status == 'string' && status.length > 1) {
            const checkStatus = checkIsValidStatus(status);

            if (!checkStatus) {
                return sendErrorMessage(res, 400, { message: 'Status Is Not Invalid' });
            }

            const changeStatus = await ReportModel.findByIdAndUpdate(_id, { status });

            if (!changeStatus) {
                return sendErrorMessage(res, 400, { message: 'Status update rr' });
            }

            return sendSuccessMessage(res, changeStatus, 'get List Reporst Success!');
        } else {
            return sendErrorMessage(res, 400, { message: 'Status Is Not Invalid' });
        }
    } catch (error) {
        console.error('error at getListReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};

//change status
export const addFeedbackReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, feedback } = req.body;

        const checkExistReport = await ReportModel.findOne({ _id, status: 'pending' });
        if (!checkExistReport) {
            return sendErrorMessage(res, 400, { message: 'This report Is Not Invalid' });
        }

        const customRequest: CustomRequest = req as CustomRequest;

        //
        const changeStatus = await ReportModel.findByIdAndUpdate(_id, {
            status: 'rejected',
            feedback,
            confirmedUserEmail: customRequest.email,
        });

        if (!changeStatus) {
            return sendErrorMessage(res, 400, { message: 'Status update Error' });
        }

        return sendSuccessMessage(res, changeStatus, 'Add Reporst Feed Success!');
    } catch (error) {
        console.error('error at getListReportController ', error);

        return sendErrorMessage(res, 500, error);
    }
};
