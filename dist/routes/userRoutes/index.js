"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/userController");
const auth_1 = require("../../helpers/auth");
const router = express_1.default.Router();
router.get('/admin/list', auth_1.checkIsLogin, auth_1.checkIsAdmin);
router.post('/admin/add-new', userController_1.addNewUserController);
router.post('/auth/login', userController_1.loginController);
router.post('/auth/logout', userController_1.logoutController);
router.get('/information', auth_1.checkIsLogin, userController_1.getOneUserController);
router.get('/admin/users', auth_1.checkIsLogin, auth_1.checkIsAdmin, userController_1.getListUserController);
exports.default = router;
//# sourceMappingURL=index.js.map