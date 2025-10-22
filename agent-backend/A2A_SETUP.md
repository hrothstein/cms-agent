# A2A Protocol Setup - Orchestrator Agent

The CMS Orchestrator Agent is now A2A-enabled and can be discovered by other agents!

## 🎯 What is A2A?

The **Agent-to-Agent (A2A) Protocol** allows AI agents to discover and communicate with each other using a standardized protocol based on JSON-RPC 2.0.

## 📋 Agent Card

The orchestrator publishes an Agent Card at:

```
GET http://localhost:3001/.well-known/agent.json
```

### Skills Available

The orchestrator exposes these skills via A2A:

1. **`manage_customer`** - Customer CRUD operations
2. **`manage_card`** - Card CRUD operations  
3. **`coordinate_agents`** - Multi-agent workflow coordination
4. **`process_natural_language`** - Natural language query processing

## 🚀 Running with A2A Enabled

### Option 1: HTTP API Only (Default)

```bash
npm run dev
```

- HTTP API on port 3001
- Agent Card available at `/.well-known/agent.json`
- No A2A task submission (discovery only)

### Option 2: Full A2A Mode

```bash
A2A_ENABLED=true npm run dev
```

- HTTP API on port 3001
- A2A Protocol Server on port 3010
- Full task submission, status, and streaming support

## 🔧 Environment Variables

Add to `.env`:

```env
# A2A Protocol
A2A_ENABLED=true
A2A_PORT=3010
ORCHESTRATOR_ENDPOINT=http://localhost:3001
AGENT_REGISTRY_URL=http://localhost:3001
```

## 🤝 Registering with Agent Registry

Once the agent registry is running, register the orchestrator:

```bash
curl -X POST http://localhost:3001/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"endpoint": "http://localhost:3001"}'
```

## 📡 A2A Protocol Endpoints

When A2A is enabled on port 3010:

- **Agent Card**: `GET /.well-known/agent.json`
- **Task Submit**: `POST /a2a/jsonrpc` (method: `task/submit`)
- **Task Status**: `POST /a2a/jsonrpc` (method: `task/status`)
- **Task Stream**: `GET /a2a/task/{task_id}/stream` (SSE)
- **Health**: `POST /a2a/jsonrpc` (method: `agent/health`)

## 🧪 Testing A2A Communication

### 1. Discover the Agent

```bash
curl http://localhost:3001/.well-known/agent.json
```

### 2. Submit a Task (requires A2A_ENABLED=true)

```bash
curl -X POST http://localhost:3010/a2a/jsonrpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-123",
    "method": "task/submit",
    "params": {
      "skill": "manage_customer",
      "parameters": {
        "operation": "get_all"
      },
      "clientAgentId": "test-agent"
    }
  }'
```

### 3. Check Task Status

```bash
curl -X POST http://localhost:3010/a2a/jsonrpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-124",
    "method": "task/status",
    "params": {
      "taskId": "task-..."
    }
  }'
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Orchestrator Agent (Port 3001/3010)  │
│                                         │
│   HTTP API:                            │
│   - Chat Interface (3001)              │
│   - Agent Card (/.well-known)          │
│                                         │
│   A2A Server (3010, optional):         │
│   - Task Management                    │
│   - JSON-RPC 2.0                      │
│   - SSE Streaming                     │
│                                         │
│   Capabilities:                        │
│   - MCP Client (CMS Tools)            │
│   - A2A Client (Call Specialists)     │
│   - A2A Server (Be Called by Others)  │
└─────────────────────────────────────────┘
           │              │
           │              │
    ┌──────▼──────┐  ┌───▼──────────┐
    │  MCP Server │  │ Specialist   │
    │  (CMS APIs) │  │ Agents (A2A) │
    └─────────────┘  └──────────────┘
```

## 📚 Integration Examples

### Python Agent Calling Orchestrator

```python
import requests

# Discover agent
agent_card = requests.get('http://localhost:3001/.well-known/agent.json').json()
print(f"Found agent: {agent_card['name']}")

# Submit task
response = requests.post('http://localhost:3010/a2a/jsonrpc', json={
    'jsonrpc': '2.0',
    'id': 'python-1',
    'method': 'task/submit',
    'params': {
        'skill': 'manage_customer',
        'parameters': {'operation': 'get_all'},
        'clientAgentId': 'python-agent'
    }
}).json()

task_id = response['result']['taskId']
print(f"Task submitted: {task_id}")
```

### Node.js Agent Using A2A SDK

```typescript
import { A2AClient } from '@cms/a2a-sdk';

// Discover and connect
const client = new A2AClient('http://localhost:3001');
const card = await client.discoverAgent();
console.log(`Connected to: ${card.name}`);

// Submit task
const task = await client.submitTask(
  'manage_customer',
  { operation: 'get_all' },
  'my-agent'
);

// Wait for completion
const status = await client.getTaskStatus(task.taskId);
console.log('Result:', status.artifact?.content);
```

## 🔍 Discovery Process

1. **Agent publishes Agent Card** at `/.well-known/agent.json`
2. **Other agents fetch the card** to discover capabilities
3. **Tasks are submitted** via JSON-RPC 2.0
4. **Orchestrator processes** using MCP or other agents
5. **Results returned** via task status or streaming

## 🎓 Benefits

- ✅ **Discoverable** - Other agents can find and use this orchestrator
- ✅ **Standard Protocol** - Uses Google's A2A specification
- ✅ **Flexible** - Can run with or without A2A server
- ✅ **Backward Compatible** - Existing HTTP chat API still works
- ✅ **Scalable** - Can coordinate multiple specialist agents

## 🚀 Next Steps

1. Build specialist agents (Fraud, Card Control, etc.)
2. Register all agents with the registry
3. Implement multi-agent workflows
4. Add visualization UI for agent collaboration

---

**The orchestrator is now ready for multi-agent collaboration!** 🤖🤖🤖

