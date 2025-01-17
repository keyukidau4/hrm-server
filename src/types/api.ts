import {Request} from "express"

export interface ApiResponse {
    code: number;
    message: string;
    data?: unknown;
}

export interface CustomRequest extends Request {
    email: string | undefined;
}
