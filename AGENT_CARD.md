# CMS Agent Card (A2A Protocol 0.3.0)

This directory contains the Agent Card for the CMS Agent, compliant with the A2A Protocol version 0.3.0.

## 📄 Files

- **`agent-card.json`** - The static Agent Card in JSON format
- **Live Endpoints**:
  - **0.3.0 Standard**: `https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent-card.json`
  - **Legacy**: `https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent.json`

## 🔍 What is an Agent Card?

An Agent Card is a standardized way for AI agents to describe their capabilities, following the [A2A Protocol](https://a2a-protocol.org/).

Think of it as a "business card" for your agent that other agents can read to:
- **Discover** what your agent can do
- **Understand** how to interact with it
- **Invoke** its skills programmatically

## 🤖 CMS Agent Capabilities

### Agent Identity
- **ID**: `cms-agent`
- **Name**: CMS Agent
- **Version**: 2.0.0
- **Protocol**: A2A 0.3.0

### Skills (4 Available)

#### 1. **manage_customer**
Comprehensive customer management including create, read, update, delete operations.

**Parameters:**
- `operation` (required): get_all, get_by_id, create, update, delete
- `customerId` (optional): Customer ID
- `name`, `email`, `phone` (optional): Customer details

#### 2. **manage_card**
Comprehensive card management including create, read, update, delete operations.

**Parameters:**
- `operation` (required): get_all, get_by_id, create, update, delete
- `cardId` (optional): Card ID
- `customerId`, `cardNumber`, `cardType`, `expiryDate` (optional): Card details

#### 3. **coordinate_agents**
Coordinate multiple specialist agents to solve complex workflows.

**Parameters:**
- `workflow` (required): fraud_investigation, compliance_check, customer_analysis
- `parameters` (required): Workflow-specific parameters

#### 4. **process_natural_language**
Process natural language queries and execute appropriate CMS operations.

**Parameters:**
- `message` (required): Natural language query from user
- `sessionId` (optional): Session ID for conversation context

## 🔐 Security

- **Authentication**: Optional (Bearer token with JWT format)
- **Security Scheme**: HTTP Bearer authentication
- **Production**: Can be configured to require authentication

## 🌐 Capabilities

- ✅ **Streaming**: Real-time task updates via Server-Sent Events
- ❌ **Push Notifications**: Not supported
- ✅ **Batch Operations**: Can process multiple operations

## 📡 Endpoints

All endpoints use JSON-RPC 2.0 protocol:

- **Task Submit**: `/a2a/task/submit`
- **Task Status**: `/a2a/task/{task_id}/status`
- **Task Stream**: `/a2a/task/{task_id}/stream`

## 🧪 Testing

**View in Browser:**
```
https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent-card.json
```

**curl:**
```bash
curl -s https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent-card.json | python3 -m json.tool
```

**Local:**
```bash
cat agent-card.json | jq .
```

## 🔄 Integration Example

Other agents can discover and use this agent:

```javascript
// Discover the agent
const response = await fetch('https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent-card.json');
const agentCard = await response.json();

console.log(`Found agent: ${agentCard.name}`);
console.log(`Available skills: ${agentCard.skills.map(s => s.id).join(', ')}`);

// Submit a task
const task = await fetch(agentCard.endpoints.task_submit, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'task/submit',
    params: {
      skill_id: 'manage_customer',
      parameters: {
        operation: 'get_all'
      }
    },
    id: 1
  })
});
```

## 📚 References

- [A2A Protocol Specification](https://a2a-protocol.org/)
- [A2A Protocol 0.3.0 Release](https://github.com/a2aproject/a2a-python/releases)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## 🔧 Updating the Agent Card

The agent card is dynamically generated from TypeScript code in:
```
agent-backend/src/config/agent-card.ts
```

To regenerate the static JSON file:
```bash
curl -s https://cms-agent-backend-space-f033db8d699b.herokuapp.com/.well-known/agent-card.json | python3 -m json.tool > agent-card.json
```

Or locally (when backend is running):
```bash
curl -s http://localhost:3001/.well-known/agent-card.json | python3 -m json.tool > agent-card.json
```

