import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"
import { sendErrorMessage } from "../api"
import { UserModel } from "../../models/users"
import { CustomRequest } from "../../types/api"

//generate jwt
export const generateJWT:(email: string) => string = (email) => {
    const secret = process.env.JWT_ENCRYPT || "test"

    const generateString =  jwt.sign({email}, secret, { expiresIn: '1d' })

    return generateString
}

//verify jwt   
export const validateJWT:(token: string) => {success: boolean, email?:string} =  (token) => {
    try {
        const secret = process.env.JWT_ENCRYPT || "test"

        const verifyToken = jwt.verify(token,secret) as {email: string}

        return {
            success: true,
            email: verifyToken.email
        }
    } catch (error) {
        console.log(error)

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
        }
    }
}

export const checkIsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookie = req.cookies['REPORT-AUTH']
        
        if( !cookie ) {
            return sendErrorMessage(res, 403, {message: "auth check failed"})
        }

        //verify Token
        const decodedToken = validateJWT(cookie)

        if( !decodedToken.success ) {
            return sendErrorMessage(res, 403, {message: "admin check failed"})
        }

        //get user data by email
        const userData = await UserModel.findOne({ email:decodedToken.email }).exec();

        if( !userData ) {
            return sendErrorMessage(res, 403, {message: "auth check failed"})
        }

        (req as CustomRequest).email = decodedToken.email

        next();

    } catch (error) {
        console.log(error)

        return sendErrorMessage(res, 500, error)
    }
}

export const checkIsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookie = req.cookies['REPORT-AUTH']

        if( !cookie ) {
            return sendErrorMessage(res, 403, {message: "admin check failed"})
        }

        const decodedToken = validateJWT(cookie)

        if( !decodedToken.success ) {
            return sendErrorMessage(res, 403, {message: "admin check failed"})
        }

        //get user data by email
        const userData = await UserModel.findOne({ email:decodedToken.email }).exec();

        if( !userData ) {
            return sendErrorMessage(res, 403, {message: "auth check failed"})
        }

        const userDataByObject = userData.toObject();

        if( !userData || ( userDataByObject.role && userDataByObject.role !== 1)) {
            return sendErrorMessage(res, 403, {message: "admin check failed"})
        }

        (req as CustomRequest).email = decodedToken.email

        next();
    } catch (error) {
        console.log(error)

        return sendErrorMessage(res, 500, error)
    }
}