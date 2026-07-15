"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.post('/forgot-password', authController_1.AuthController.forgotPassword);
router.post('/reset-password', authController_1.AuthController.resetPassword);
// Protected client routes
router.get('/profile', authMiddleware_1.authenticateToken, authMiddleware_1.requireClient, authController_1.AuthController.getProfile);
router.put('/profile', authMiddleware_1.authenticateToken, authMiddleware_1.requireClient, authController_1.AuthController.updateProfile);
exports.default = router;
