"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorMessage = exports.sendSuccessMessage = void 0;
//Success status response
const sendSuccessMessage = (res, data, message) => {
    const response = {
        code: 200,
        message,
        data,
    };
    res.status(200).send(response);
};
exports.sendSuccessMessage = sendSuccessMessage;
//error status response
const sendErrorMessage = (res, code, error) => {
    let message = error.message;
    const response = {
        code,
        message,
    };
    res.status(code).send(response);
};
exports.sendErrorMessage = sendErrorMessage;
//# sourceMappingURL=index.js.map