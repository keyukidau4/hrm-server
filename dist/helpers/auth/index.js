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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAdmin = exports.checkIsLogin = exports.validateJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_1 = require("../api");
const users_1 = require("../../models/users");
//generate jwt
const generateJWT = (email) => {
    const secret = process.env.JWT_ENCRYPT || "test";
    const generateString = jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: '1d' });
    return generateString;
};
exports.generateJWT = generateJWT;
//verify jwt   
const validateJWT = (token) => {
    try {
        const secret = process.env.JWT_ENCRYPT || "test";
        const verifyToken = jsonwebtoken_1.default.verify(token, secret);
        return {
            success: true,
            email: verifyToken.email
        };
    }
    catch (error) {
        console.log(error);
        /**
         * if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
            return "Token expired";
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token");
            return "Invalid token";
        } else {
            console.error("Unknown error", error);
            return "Unknown error";
        }
         *
         */
        return {
            success: false
        };
    }
};
exports.validateJWT = validateJWT;
const checkIsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies['REPORT-AUTH'];
        if (!cookie) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "auth check failed" });
        }
        //verify Token
        const decodedToken = (0, exports.validateJWT)(cookie);
        if (!decodedToken.success) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "admin check failed" });
        }
        //get user data by email
        const userData = yield users_1.UserModel.findOne({ email: decodedToken.email }).exec();
        if (!userData) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "auth check failed" });
        }
        req.email = decodedToken.email;
        next();
    }
    catch (error) {
        console.log(error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.checkIsLogin = checkIsLogin;
const checkIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies['REPORT-AUTH'];
        if (!cookie) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "admin check failed" });
        }
        const decodedToken = (0, exports.validateJWT)(cookie);
        if (!decodedToken.success) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "admin check failed" });
        }
        //get user data by email
        const userData = yield users_1.UserModel.findOne({ email: decodedToken.email }).exec();
        if (!userData) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "auth check failed" });
        }
        const userDataByObject = userData.toObject();
        if (!userData || (userDataByObject.role && userDataByObject.role !== 1)) {
            return (0, api_1.sendErrorMessage)(res, 403, { message: "admin check failed" });
        }
        req.email = decodedToken.email;
        next();
    }
    catch (error) {
        console.log(error);
        return (0, api_1.sendErrorMessage)(res, 500, error);
    }
});
exports.checkIsAdmin = checkIsAdmin;
//# sourceMappingURL=index.js.map