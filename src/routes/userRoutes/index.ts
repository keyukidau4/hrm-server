import express from 'express';
import {
    addNewUserController,
    getListUserController,
    getOneUserController,
    loginController,
    logoutController,
} from '../../controllers/userController';
import { checkIsAdmin, checkIsLogin } from '../../helpers/auth';

const router = express.Router();

router.get('/admin/list', checkIsLogin, checkIsAdmin);
router.post('/admin/add-new', addNewUserController);

router.post('/auth/login', loginController);
router.post('/auth/logout', logoutController);

router.get('/information', checkIsLogin, getOneUserController);
router.get('/admin/users', checkIsLogin, checkIsAdmin, getListUserController);

export default router;
