/**
 * Agent Registry Server
 * Central registry for agent discovery and health monitoring
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { registryRouter, registryService } from './routes/registry.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/agents', registryRouter);
app.use('/api/v1', registryRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    healthy: true,
    service: 'agent-registry',
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Agent Registry',
    version: '1.0.0',
    description: 'Central registry for A2A multi-agent system',
    endpoints: {
      register: 'POST /api/v1/agents/register',
      listAgents: 'GET /api/v1/agents',
      getAgent: 'GET /api/v1/agents/:agentId',
      unregister: 'DELETE /api/v1/agents/:agentId',
      healthCheck: 'POST /api/v1/agents/:agentId/health',
      healthCheckAll: 'POST /api/v1/agents/health/all',
      stats: 'GET /api/v1/stats',
    },
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║       🏢  AGENT REGISTRY SERVER  🏢                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📍 Running on: http://localhost:${PORT}
🔍 Agent Discovery API ready
🏥 Health monitoring active

Endpoints:
  • POST /api/v1/agents/register - Register agent
  • GET  /api/v1/agents - List all agents
  • GET  /api/v1/agents/:id - Get agent details
  • POST /api/v1/agents/:id/health - Health check agent

Ready to coordinate multi-agent system! 🤖🤖🤖
`);

  // Start periodic health checks (every 60 seconds)
  if (process.env.ENABLE_HEALTH_CHECKS !== 'false') {
    registryService.startPeriodicHealthChecks(60000);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  registryService.stopPeriodicHealthChecks();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  registryService.stopPeriodicHealthChecks();
  process.exit(0);
});

