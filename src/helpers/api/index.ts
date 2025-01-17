import { ApiResponse } from '../../types/api';
import { Response } from 'express';

//Success status response
export const sendSuccessMessage = (res: Response, data: unknown, message: string) => {
    const response: ApiResponse = {
        code: 200,
        message,
        data,
    };

    res.status(200).send(response);
};

//error status response
export const sendErrorMessage = (res: Response, code: number, error: any) => {
    let message = error.message;

    const response: ApiResponse = {
        code,
        message,
    };
    res.status(code).send(response);
};
