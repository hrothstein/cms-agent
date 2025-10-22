# Agent Registry Service

Central registry for agent discovery and health monitoring in the A2A multi-agent system.

## Features

- **Agent Registration**: Register specialist agents
- **Agent Discovery**: Find agents by skill or capability
- **Health Monitoring**: Periodic health checks
- **Status Tracking**: Track agent availability
- **Statistics**: Registry metrics

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```
PORT=3001
ENABLE_HEALTH_CHECKS=true
```

## Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Register Agent

```bash
POST /api/v1/agents/register
Content-Type: application/json

{
  "endpoint": "http://fraud-agent:3002"
}
```

### List All Agents

```bash
GET /api/v1/agents
```

Query parameters:
- `?status=active` - Filter by status
- `?capability=fraud_detection` - Filter by capability
- `?skill=analyze_transaction` - Filter by skill

### Get Agent Details

```bash
GET /api/v1/agents/:agentId
```

### Unregister Agent

```bash
DELETE /api/v1/agents/:agentId
```

### Health Check

```bash
# Single agent
POST /api/v1/agents/:agentId/health

# All agents
POST /api/v1/agents/health/all
```

### Registry Statistics

```bash
GET /api/v1/stats
```

## Integration Example

```typescript
import axios from 'axios';

// Register an agent
const response = await axios.post('http://localhost:3001/api/v1/agents/register', {
  endpoint: 'http://fraud-agent:3002'
});

// Find agents by skill
const agents = await axios.get('http://localhost:3001/api/v1/agents?skill=analyze_transaction');

// Health check
await axios.post('http://localhost:3001/api/v1/agents/fraud-detection-agent/health');
```

## Architecture

```
┌─────────────────┐
│  Orchestrator   │  ← Queries registry to discover agents
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Agent Registry    │  ← Central registry
│   - Discovery      │
│   - Health checks  │
│   - Status         │
└────────┬───────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼───┐  ┌──▼────┐
│ Agent │  │ Agent │  ← Specialist agents register here
│   1   │  │   2   │
└───────┘  └───────┘
```

## License

MIT

