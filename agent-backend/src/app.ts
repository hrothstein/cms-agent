// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';
import { orchestratorAgentCard } from './config/agent-card';
import { createOrchestratorA2AServer } from './services/orchestrator-a2a.service';

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
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

// A2A Agent Card endpoint
app.get('/.well-known/agent.json', (req, res) => {
  res.json(orchestratorAgentCard);
});

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
    name: 'CMS Orchestrator Agent',
    version: '2.0.0',
    status: 'running',
    a2a_enabled: process.env.A2A_ENABLED === 'true',
    agent_card: `${req.protocol}://${req.get('host')}/.well-known/agent.json`,
    endpoints: {
      chat: '/api/v1/chat',
      health: '/health',
      agent_card: '/.well-known/agent.json'
    }
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
const A2A_PORT = parseInt(process.env.A2A_PORT || '3010');
const A2A_ENABLED = process.env.A2A_ENABLED === 'true';

app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🤖 CMS ORCHESTRATOR AGENT V2.0                     ║
║                                                       ║
║   HTTP API Port: ${PORT}                              ║
║   A2A Port: ${A2A_ENABLED ? A2A_PORT : 'Disabled'}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   MCP Server: ${process.env.MCP_BASE_URL?.substring(0, 40) || 'Not configured'}...  ║
║                                                       ║
║   🌐 HTTP Endpoints:                                 ║
║   - POST   /api/v1/chat/message                     ║
║   - GET    /api/v1/chat/history/:sessionId          ║
║   - DELETE /api/v1/chat/history/:sessionId          ║
║   - GET    /api/v1/chat/capabilities                ║
║   - GET    /.well-known/agent.json                  ║
║   - GET    /health                                   ║
║                                                       ║
║   📡 Capabilities:                                   ║
║   - Natural Language Chat                            ║
║   - Customer Management (via MCP)                   ║
║   - Card Management (via MCP)                       ║
║   - Multi-Agent Coordination (A2A)                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  // Start A2A server if enabled
  if (A2A_ENABLED) {
    try {
      const a2aServer = createOrchestratorA2AServer();
      await a2aServer.start(A2A_PORT);
      console.log(`
✅ A2A Protocol Server started on port ${A2A_PORT}
   Agent ID: ${orchestratorAgentCard.id}
   Agent Card: http://localhost:${A2A_PORT}/.well-known/agent.json
   Skills: ${orchestratorAgentCard.skills.map(s => s.name).join(', ')}
   
   Other agents can now discover and delegate tasks to this orchestrator!
      `);
    } catch (error) {
      console.error('❌ Failed to start A2A server:', error);
    }
  } else {
    console.log(`
ℹ️  A2A Protocol Server is disabled
   Set A2A_ENABLED=true to enable agent-to-agent communication
   Agent Card available at: http://localhost:${PORT}/.well-known/agent.json
    `);
  }
});

export default app;

