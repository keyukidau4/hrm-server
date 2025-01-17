import express from 'express';
import { checkIsAdmin, checkIsLogin } from '../../helpers/auth';
import {
    addFeedbackReportController,
    addNewReport,
    changeStatusReportController,
    getListReportbyAdminController,
    getListReportController,
    getSingleReportController,
    updateReportController,
} from '../../controllers/reportController';

const router = express.Router();

router.get('/admin/list-report', checkIsLogin, checkIsAdmin, getListReportbyAdminController);

router.post('/admin/change-status', checkIsLogin, checkIsAdmin, changeStatusReportController);

router.post('/admin/add-feedback', checkIsLogin, checkIsAdmin, addFeedbackReportController);

router.get('/client/list-report', checkIsLogin, getListReportController);

router.post('/client/add', checkIsLogin, addNewReport);

router.get('/client/single-report', checkIsLogin, getSingleReportController);

router.post('/client/update', checkIsLogin, updateReportController);

export default router;
