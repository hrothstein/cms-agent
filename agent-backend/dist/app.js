"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/v1/chat', chat_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'CMS Admin Agent API',
        version: '1.0.0',
        status: 'running',
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   CMS Admin Agent Backend                            ║
║                                                       ║
║   Port: ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   MCP Server: ${process.env.MCP_BASE_URL?.substring(0, 40) || 'Not configured'}...  ║
║                                                       ║
║   Endpoints:                                         ║
║   - POST   /api/v1/chat/message                     ║
║   - GET    /api/v1/chat/history/:sessionId          ║
║   - DELETE /api/v1/chat/history/:sessionId          ║
║   - GET    /api/v1/chat/capabilities                ║
║   - GET    /health                                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
exports.default = app;
