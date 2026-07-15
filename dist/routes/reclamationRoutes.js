"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reclamationController_1 = require("../controllers/reclamationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Client routes
router.post('/', authMiddleware_1.authenticateToken, authMiddleware_1.requireClient, reclamationController_1.ReclamationController.create);
router.get('/my', authMiddleware_1.authenticateToken, authMiddleware_1.requireClient, reclamationController_1.ReclamationController.getClientHistory);
// Admin routes
router.get('/admin', authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin, reclamationController_1.ReclamationController.listAll);
router.get('/admin/pending', authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin, reclamationController_1.ReclamationController.listPending);
router.put('/admin/:id/process', authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin, reclamationController_1.ReclamationController.process);
exports.default = router;
