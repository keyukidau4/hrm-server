import { Request, Response } from 'express';
import { sendErrorMessage, sendSuccessMessage } from '../helpers/api';
import { UserModel } from '../models/users';
import { generateJWT } from '../helpers/auth';
import { CustomRequest } from '../types/api';

export const loginController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendErrorMessage(res, 400, { message: 'Email And Password is required!' });
        }

        //check user
        const userData = await UserModel.findOne({ email }).exec();

        //check user is exist
        if (!userData) {
            return sendErrorMessage(res, 400, { message: 'Email Or Password is invalid!' });
        }

        //check password
        if (userData.password !== password) {
            return sendErrorMessage(res, 400, { message: 'Email Or Password is invalid!' });
        }

        const { password: userPass, ...resData } = userData.toObject();

        const token = generateJWT(email);

        res.cookie('REPORT-AUTH', token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        const returnUserInformation = {
            id: resData._id,
            email: resData.email,
            firstName: resData.firstName,
            lastName: resData.lastName,
            role: resData.role,
            sex: resData.sex,
        };

        return sendSuccessMessage(res, returnUserInformation, 'login success!');
    } catch (error) {
        console.error('Error with loginController' + error);

        return res.status(500).send({
            code: 500,
            message: 'Error WIth loginController',
        });
    }
};

export const logoutController = async (req: Request, res: Response): Promise<any> => {
    try {
        res.clearCookie('REPORT-AUTH');

        return sendSuccessMessage(res, {}, 'logout success!');
    } catch (error) {
        console.error('Error with logoutController' + error);

        return res.status(500).send({
            code: 500,
            message: 'Error WIth logoutController',
        });
    }
};

export const addNewUserController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName, lastName, email, password, dayOfBirth, role, sex, salary, position } =
            req.body;

        const createNew = await new UserModel({
            firstName,
            lastName,
            email,
            password,
            dayOfBirth,
            role,
            sex,
            salary,
            position,
        }).save();

        return sendSuccessMessage(res, { createNew }, 'login success!');
    } catch (error) {
        console.error('Error with addNewUserController' + error);
        return sendErrorMessage(res, 500, {});
    }
};

export const getOneUserController = async (req: Request, res: Response): Promise<any> => {
    try {
        const request: CustomRequest = req as CustomRequest;

        const requestEmail = request.email;

        //get data from model
        const userData = await UserModel.findOne({ email: requestEmail }).exec();

        if (!userData) {
            return sendErrorMessage(res, 400, { message: 'this id is not exist!' });
        }

        const { password: userPass, ...resData } = userData.toObject();

        return sendSuccessMessage(res, resData, 'get success');
    } catch (error) {
        console.log(`Error with get User Information controller ${error}`);

        return sendErrorMessage(res, 500, {
            message: 'Error with get User Information controller',
            error,
        });
    }
};

export const getListUserController = async (req: Request, res: Response): Promise<any> => {
    try {
        //get data from model
        const userData = await UserModel.find({ role: 0 }).exec();

        if (!userData) {
            return sendErrorMessage(res, 400, { message: 'this id is not exist!' });
        }

        const resData = userData.map((vl) => {
            const { password: userPass, ...resData } = vl.toObject();

            return resData;
        });
        return sendSuccessMessage(res, resData, 'get success');
    } catch (error) {
        console.log(`Error with getListUserController controller ${error}`);

        return sendErrorMessage(res, 500, {
            message: 'Error with getListUserController controller',
            error,
        });
    }
};
