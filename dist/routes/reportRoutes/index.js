"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../helpers/auth");
const reportController_1 = require("../../controllers/reportController");
const router = express_1.default.Router();
router.get('/admin/list-report', auth_1.checkIsLogin, auth_1.checkIsAdmin, reportController_1.getListReportbyAdminController);
router.post('/admin/change-status', auth_1.checkIsLogin, auth_1.checkIsAdmin, reportController_1.changeStatusReportController);
router.post('/admin/add-feedback', auth_1.checkIsLogin, auth_1.checkIsAdmin, reportController_1.addFeedbackReportController);
router.get('/client/list-report', auth_1.checkIsLogin, reportController_1.getListReportController);
router.post('/client/add', auth_1.checkIsLogin, reportController_1.addNewReport);
router.get('/client/single-report', auth_1.checkIsLogin, reportController_1.getSingleReportController);
router.post('/client/update', auth_1.checkIsLogin, reportController_1.updateReportController);
exports.default = router;
//# sourceMappingURL=index.js.map