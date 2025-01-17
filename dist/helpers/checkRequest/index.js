"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidStatus = void 0;
const reports_1 = require("../../types/reports");
const checkIsValidStatus = (value) => {
    return Object.values(reports_1.StatusEnum).includes(value);
};
exports.checkIsValidStatus = checkIsValidStatus;
//# sourceMappingURL=index.js.map