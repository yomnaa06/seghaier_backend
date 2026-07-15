"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env
dotenv_1.default.config();
// Importation de routers
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const devisRoutes_1 = __importDefault(require("./routes/devisRoutes"));
const reclamationRoutes_1 = __importDefault(require("./routes/reclamationRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Enable CORS
app.use((0, cors_1.default)());
// Parse JSON request bodies
app.use(express_1.default.json());
// Mount API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/devis', devisRoutes_1.default);
app.use('/api/reclamations', reclamationRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Healthcheck endpoint
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date(),
        message: 'Groupe Seghaier Backend API is running.',
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`[Server]: API is running at http://localhost:${PORT}`);
});
