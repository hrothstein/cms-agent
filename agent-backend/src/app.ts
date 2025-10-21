// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/chat', chatRoutes);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default app;

