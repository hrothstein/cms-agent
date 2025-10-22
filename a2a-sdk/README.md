# A2A SDK - Agent-to-Agent Protocol

Implementation of Google's Agent-to-Agent (A2A) Protocol for multi-agent systems.

## Features

- **A2A Client SDK**: Communicate with remote agents
- **A2A Server SDK**: Expose agent capabilities
- **JSON-RPC 2.0**: Standard protocol transport
- **Task Management**: Complete lifecycle management
- **SSE Streaming**: Real-time task progress
- **Agent Discovery**: Via Agent Cards (/.well-known/agent.json)

## Installation

```bash
npm install
npm run build
```

## Usage

### Creating an A2A Server (Specialist Agent)

```typescript
import { A2AServer, AgentCard, SkillHandler } from '@cms/a2a-sdk';

const agentCard: AgentCard = {
  id: 'fraud-detection-agent',
  name: 'Fraud Detection Specialist',
  description: 'Analyzes transactions for fraud',
  version: '1.0.0',
  skills: [
    {
      name: 'analyze_transaction',
      description: 'Analyze transaction for fraud',
      parameters: {
        transactionId: { type: 'string', required: true }
      },
      returns: {
        riskScore: { type: 'number' },
        recommendation: { type: 'string' }
      }
    }
  ],
  endpoints: {
    task_submit: 'https://fraud-agent.example.com/a2a/task/submit'
  }
};

const skillHandlers = new Map<string, SkillHandler>();

skillHandlers.set('analyze_transaction', async (params) => {
  const { transactionId } = params;
  // Your fraud detection logic here
  return {
    riskScore: 85,
    recommendation: 'lock_card'
  };
});

const server = new A2AServer(agentCard, skillHandlers, { port: 3002 });
await server.start();
```

### Using the A2A Client (Orchestrator)

```typescript
import { A2AClient } from '@cms/a2a-sdk';

// Discover agent
const client = new A2AClient('https://fraud-agent.example.com');
const agentCard = await client.discoverAgent();

// Submit task
const task = await client.submitTask(
  'analyze_transaction',
  { transactionId: 'TXN123' },
  'orchestrator-agent'
);

// Poll for completion
while (true) {
  const status = await client.getTaskStatus(task.taskId);
  if (status.status === 'COMPLETED') {
    console.log('Result:', status.artifact.content);
    break;
  }
  await sleep(1000);
}
```

### Streaming Task Progress

```typescript
// Stream task updates
for await (const update of client.streamTask(task.taskId)) {
  console.log(`Status: ${update.status}, Progress: ${update.progress}%`);
  if (update.status === 'COMPLETED') {
    console.log('Result:', update.artifact);
    break;
  }
}
```

## Architecture

```
┌─────────────────┐
│  Orchestrator   │  ← Uses A2A Client
│     Agent       │
└────────┬────────┘
         │
         │ JSON-RPC 2.0
         │
    ┌────▼────┐
    │ A2A SDK │
    └────┬────┘
         │
┌────────▼─────────┐
│ Specialist Agent │  ← Uses A2A Server
│   (Fraud, etc)   │
└──────────────────┘
```

## Protocol

Based on JSON-RPC 2.0 with A2A extensions:

- **Agent Cards**: Published at `/.well-known/agent.json`
- **Task Submit**: `POST /a2a/jsonrpc` with method `task/submit`
- **Task Status**: `POST /a2a/jsonrpc` with method `task/status`
- **Task Stream**: `GET /a2a/task/{taskId}/stream` (SSE)

## License

MIT

