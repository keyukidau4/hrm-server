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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListUserController = exports.getOneUserController = exports.addNewUserController = exports.logoutController = exports.loginController = void 0;
const api_1 = require("../helpers/api");
const users_1 = require("../models/users");
const auth_1 = require("../helpers/auth");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Email And Password is required!' });
        }
        //check user
        const userData = yield users_1.UserModel.findOne({ email }).exec();
        //check user is exist
        if (!userData) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Email Or Password is invalid!' });
        }
        //check password
        if (userData.password !== password) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'Email Or Password is invalid!' });
        }
        const _a = userData.toObject(), { password: userPass } = _a, resData = __rest(_a, ["password"]);
        const token = (0, auth_1.generateJWT)(email);
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
        return (0, api_1.sendSuccessMessage)(res, returnUserInformation, 'login success!');
    }
    catch (error) {
        console.error('Error with loginController' + error);
        return res.status(500).send({
            code: 500,
            message: 'Error WIth loginController',
        });
    }
});
exports.loginController = loginController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('REPORT-AUTH');
        return (0, api_1.sendSuccessMessage)(res, {}, 'logout success!');
    }
    catch (error) {
        console.error('Error with logoutController' + error);
        return res.status(500).send({
            code: 500,
            message: 'Error WIth logoutController',
        });
    }
});
exports.logoutController = logoutController;
const addNewUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, dayOfBirth, role, sex, salary, position } = req.body;
        const createNew = yield new users_1.UserModel({
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
        return (0, api_1.sendSuccessMessage)(res, { createNew }, 'login success!');
    }
    catch (error) {
        console.error('Error with addNewUserController' + error);
        return (0, api_1.sendErrorMessage)(res, 500, {});
    }
});
exports.addNewUserController = addNewUserController;
const getOneUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req;
        const requestEmail = request.email;
        //get data from model
        const userData = yield users_1.UserModel.findOne({ email: requestEmail }).exec();
        if (!userData) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'this id is not exist!' });
        }
        const _a = userData.toObject(), { password: userPass } = _a, resData = __rest(_a, ["password"]);
        return (0, api_1.sendSuccessMessage)(res, resData, 'get success');
    }
    catch (error) {
        console.log(`Error with get User Information controller ${error}`);
        return (0, api_1.sendErrorMessage)(res, 500, {
            message: 'Error with get User Information controller',
            error,
        });
    }
});
exports.getOneUserController = getOneUserController;
const getListUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get data from model
        const userData = yield users_1.UserModel.find({ role: 0 }).exec();
        if (!userData) {
            return (0, api_1.sendErrorMessage)(res, 400, { message: 'this id is not exist!' });
        }
        const resData = userData.map((vl) => {
            const _a = vl.toObject(), { password: userPass } = _a, resData = __rest(_a, ["password"]);
            return resData;
        });
        return (0, api_1.sendSuccessMessage)(res, resData, 'get success');
    }
    catch (error) {
        console.log(`Error with getListUserController controller ${error}`);
        return (0, api_1.sendErrorMessage)(res, 500, {
            message: 'Error with getListUserController controller',
            error,
        });
    }
});
exports.getListUserController = getListUserController;
//# sourceMappingURL=userController.js.map