# CMS V2: Agent-to-Agent (A2A) Protocol Support - Product Requirements Document

## 🎯 Executive Summary

Extend the Card Management System ecosystem with **Google's Agent-to-Agent (A2A) Protocol** support, enabling multiple specialized AI agents to discover, communicate, and collaborate on complex banking operations. This V2 enhancement transforms the single Admin Agent into a multi-agent system where specialized agents work together to solve sophisticated financial services workflows.

**System Architecture with A2A:**
```
┌─────────────────────────┐
│  Bank Employee          │  ← Human User
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Orchestrator Agent     │  ← Main entry point (A2A Client)
│  (Admin Agent V2)       │
└───────────┬─────────────┘
            │
            │ A2A Protocol (JSON-RPC 2.0 over HTTP)
            │
     ┌──────┴──────┬──────────────┬──────────────┐
     │             │              │              │
┌────▼─────┐ ┌────▼─────┐ ┌─────▼────┐ ┌───────▼──────┐
│ Fraud    │ │ Card     │ │Customer  │ │ Compliance   │
│ Detection│ │ Control  │ │ Service  │ │ Agent        │
│ Agent    │ │ Agent    │ │ Agent    │ │              │
└────┬─────┘ └────┬─────┘ └─────┬────┘ └───────┬──────┘
     │            │              │              │
     │            │              │              │
     └────────────┴──────────────┴──────────────┘
                         │
                    MCP Server
                         │
                   CMS Backend APIs
                         │
                    Database
```

**Key Innovation:** 
- **MCP** (existing): Agents ↔ Tools/CMS APIs
- **A2A** (new): Agents ↔ Agents

---

## 📋 Problem Statement

The current single Admin Agent handles all operations, but real banking operations require:
- **Specialized expertise**: Fraud detection requires different AI models than customer service
- **Parallel processing**: Multiple agents working simultaneously on different aspects
- **Complex workflows**: Multi-step processes that span multiple domains
- **Scalability**: Adding new agent capabilities without rebuilding existing agents
- **Interoperability**: Agents from different vendors/frameworks working together

**A2A Protocol solves this by:**
- Enabling agents to discover each other's capabilities
- Standardizing agent-to-agent communication
- Allowing specialized agents to collaborate
- Preserving agent autonomy and security (opaque collaboration)

---

## 🎯 Goals & Objectives

**Primary Goal:** Demonstrate multi-agent collaboration for Financial Services using Google's A2A Protocol

**Demo Objectives:**
1. Showcase agent specialization and collaboration
2. Demonstrate A2A protocol implementation (Agent Cards, Task Management)
3. Show how multiple agents solve complex banking workflows
4. Highlight MCP + A2A working together (tools + agents)
5. Prove scalability of adding new specialized agents
6. Show MuleSoft/Salesforce value in multi-agent orchestration

---

## 🤖 Agent Ecosystem

### V2 Multi-Agent Architecture

#### 1. **Orchestrator Agent** (Main Entry Point)
**Role:** Central coordinator, routes user requests to specialized agents

**Capabilities:**
- Understands user intent
- Discovers available agents via A2A Agent Cards
- Delegates tasks to appropriate specialist agents
- Aggregates responses from multiple agents
- Maintains conversation context with user

**Agent Card:**
```json
{
  "id": "orchestrator-agent",
  "name": "CMS Orchestrator Agent",
  "description": "Main coordinator for all CMS operations",
  "version": "2.0.0",
  "capabilities": [
    "task_delegation",
    "agent_discovery",
    "context_management",
    "response_aggregation"
  ],
  "endpoints": {
    "task_submit": "https://cms-orchestrator.example.com/a2a/task/submit",
    "task_status": "https://cms-orchestrator.example.com/a2a/task/{task_id}/status",
    "task_stream": "https://cms-orchestrator.example.com/a2a/task/{task_id}/stream"
  },
  "supported_protocols": ["JSON-RPC 2.0"],
  "authentication": {
    "type": "Bearer",
    "required": true
  }
}
```

---

#### 2. **Fraud Detection Agent** (Specialized)
**Role:** Analyzes transactions and patterns to detect fraudulent activity

**Capabilities:**
- Transaction pattern analysis
- Anomaly detection
- Risk scoring
- Fraud case investigation
- Recommendation generation

**Skills:**
- `analyze_transaction(transactionId)` - Analyze single transaction
- `analyze_pattern(customerId, timeframe)` - Pattern analysis
- `risk_score(transactionId)` - Calculate risk score
- `investigate_fraud(transactionId)` - Deep investigation
- `recommend_action(transactionId)` - Suggest actions (lock card, alert customer)

**Agent Card:**
```json
{
  "id": "fraud-detection-agent",
  "name": "Fraud Detection Specialist",
  "description": "Analyzes transactions and detects fraudulent patterns",
  "version": "1.0.0",
  "skills": [
    {
      "name": "analyze_transaction",
      "description": "Analyze a transaction for fraud indicators",
      "parameters": {
        "transactionId": "string (required)"
      },
      "returns": {
        "riskScore": "number (0-100)",
        "indicators": "array of string",
        "recommendation": "string"
      }
    },
    {
      "name": "analyze_pattern",
      "description": "Analyze transaction patterns for a customer",
      "parameters": {
        "customerId": "string (required)",
        "timeframe": "string (optional, default: 30d)"
      },
      "returns": {
        "patterns": "array",
        "anomalies": "array",
        "riskLevel": "string (low/medium/high)"
      }
    }
  ],
  "endpoints": {
    "task_submit": "https://cms-fraud-agent.example.com/a2a/task/submit"
  }
}
```

---

#### 3. **Card Control Agent** (Specialized)
**Role:** Manages all card operations (lock, unlock, controls, limits)

**Capabilities:**
- Card lifecycle management
- Control configuration
- Instant card locking/unlocking
- Limit management
- Authorization rules

**Skills:**
- `lock_card(cardId, reason)` - Lock card immediately
- `unlock_card(cardId)` - Unlock card
- `update_controls(cardId, controls)` - Update card controls
- `set_limits(cardId, limits)` - Set spending limits
- `emergency_block(cardId, reason)` - Emergency card block

**Agent Card:**
```json
{
  "id": "card-control-agent",
  "name": "Card Control Specialist",
  "description": "Manages card operations and security controls",
  "version": "1.0.0",
  "skills": [
    {
      "name": "lock_card",
      "description": "Lock a card immediately",
      "parameters": {
        "cardId": "string (required)",
        "reason": "string (required)"
      },
      "returns": {
        "success": "boolean",
        "lockedAt": "timestamp",
        "status": "string"
      }
    },
    {
      "name": "update_controls",
      "description": "Update card security controls",
      "parameters": {
        "cardId": "string (required)",
        "controls": "object (required)"
      },
      "returns": {
        "success": "boolean",
        "updatedControls": "object"
      }
    }
  ],
  "endpoints": {
    "task_submit": "https://cms-card-agent.example.com/a2a/task/submit"
  }
}
```

---

#### 4. **Customer Service Agent** (Specialized)
**Role:** Handles customer inquiries, account information, and service requests

**Capabilities:**
- Customer profile lookup
- Transaction history retrieval
- Account information
- Service request handling
- Customer communication

**Skills:**
- `get_customer_profile(customerId)` - Get customer details
- `get_transaction_history(customerId, filters)` - Transaction history
- `search_customer(query)` - Search customers
- `create_service_request(customerId, type, details)` - Create request
- `get_account_summary(customerId)` - Account overview

**Agent Card:**
```json
{
  "id": "customer-service-agent",
  "name": "Customer Service Specialist",
  "description": "Handles customer information and service requests",
  "version": "1.0.0",
  "skills": [
    {
      "name": "get_customer_profile",
      "description": "Retrieve customer profile and details",
      "parameters": {
        "customerId": "string (required)"
      },
      "returns": {
        "profile": "object",
        "cards": "array",
        "accounts": "array"
      }
    },
    {
      "name": "get_transaction_history",
      "description": "Get transaction history for customer",
      "parameters": {
        "customerId": "string (required)",
        "filters": "object (optional)"
      },
      "returns": {
        "transactions": "array",
        "summary": "object"
      }
    }
  ],
  "endpoints": {
    "task_submit": "https://cms-customer-agent.example.com/a2a/task/submit"
  }
}
```

---

#### 5. **Compliance Agent** (Specialized)
**Role:** Ensures operations comply with banking regulations

**Capabilities:**
- Regulatory compliance checking
- AML (Anti-Money Laundering) screening
- KYC (Know Your Customer) verification
- Transaction monitoring for compliance
- Reporting requirements

**Skills:**
- `check_compliance(operation, data)` - Check if operation is compliant
- `aml_screen(customerId, transactionId)` - AML screening
- `kyc_verify(customerId)` - KYC verification status
- `generate_sar(transactionId)` - Generate Suspicious Activity Report
- `check_limits(transactionId)` - Check regulatory limits

**Agent Card:**
```json
{
  "id": "compliance-agent",
  "name": "Compliance Specialist",
  "description": "Ensures banking operations comply with regulations",
  "version": "1.0.0",
  "skills": [
    {
      "name": "check_compliance",
      "description": "Verify operation compliance with regulations",
      "parameters": {
        "operation": "string (required)",
        "data": "object (required)"
      },
      "returns": {
        "compliant": "boolean",
        "issues": "array",
        "recommendations": "array"
      }
    },
    {
      "name": "aml_screen",
      "description": "Perform AML screening",
      "parameters": {
        "customerId": "string (required)",
        "transactionId": "string (optional)"
      },
      "returns": {
        "clearance": "boolean",
        "alerts": "array",
        "riskLevel": "string"
      }
    }
  ],
  "endpoints": {
    "task_submit": "https://cms-compliance-agent.example.com/a2a/task/submit"
  }
}
```

---

## 🔌 A2A Protocol Implementation

### Core Concepts

#### 1. **Agent Cards**
Each agent publishes an Agent Card at `/.well-known/agent.json`

**Standard Agent Card Structure:**
```json
{
  "id": "agent-unique-id",
  "name": "Human-readable agent name",
  "description": "What this agent does",
  "version": "1.0.0",
  "skills": [
    {
      "name": "skill_name",
      "description": "What this skill does",
      "parameters": {
        "param1": "type (required/optional)"
      },
      "returns": {
        "field1": "type"
      }
    }
  ],
  "endpoints": {
    "task_submit": "https://agent-url/a2a/task/submit",
    "task_status": "https://agent-url/a2a/task/{task_id}/status",
    "task_stream": "https://agent-url/a2a/task/{task_id}/stream"
  },
  "supported_protocols": ["JSON-RPC 2.0"],
  "authentication": {
    "type": "Bearer",
    "required": true
  },
  "capabilities": ["list", "of", "high-level", "capabilities"]
}
```

#### 2. **Task Management**

**Task Lifecycle:**
```
PENDING → IN_PROGRESS → [COMPLETED | FAILED | CANCELLED]
```

**Task Object:**
```json
{
  "taskId": "unique-task-id",
  "clientAgentId": "requesting-agent-id",
  "remoteAgentId": "fulfilling-agent-id",
  "skill": "skill_name",
  "parameters": {
    "param1": "value1"
  },
  "status": "IN_PROGRESS",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:05Z",
  "completedAt": null,
  "artifact": null,
  "messages": []
}
```

**Task Artifact (Output):**
```json
{
  "artifactId": "unique-artifact-id",
  "taskId": "task-id",
  "contentType": "application/json",
  "content": {
    "riskScore": 85,
    "recommendation": "Lock card immediately",
    "reasons": ["Unusual location", "High amount", "Velocity pattern"]
  },
  "createdAt": "2025-01-01T10:00:10Z"
}
```

#### 3. **Message Exchange**

**Message Structure:**
```json
{
  "messageId": "unique-message-id",
  "taskId": "task-id",
  "from": "agent-id",
  "to": "agent-id",
  "parts": [
    {
      "type": "text",
      "content": "Analysis complete. Card should be locked."
    },
    {
      "type": "json",
      "content": {
        "riskScore": 85,
        "indicators": ["unusual_location", "high_amount"]
      }
    }
  ],
  "timestamp": "2025-01-01T10:00:10Z"
}
```

#### 4. **JSON-RPC 2.0 Methods**

**Method: `task/submit`**
```json
Request:
{
  "jsonrpc": "2.0",
  "id": "req-123",
  "method": "task/submit",
  "params": {
    "skill": "analyze_transaction",
    "parameters": {
      "transactionId": "TXN998877"
    },
    "clientAgentId": "orchestrator-agent"
  }
}

Response:
{
  "jsonrpc": "2.0",
  "id": "req-123",
  "result": {
    "taskId": "task-abc-123",
    "status": "PENDING",
    "estimatedCompletionTime": "2025-01-01T10:00:15Z"
  }
}
```

**Method: `task/status`**
```json
Request:
{
  "jsonrpc": "2.0",
  "id": "req-124",
  "method": "task/status",
  "params": {
    "taskId": "task-abc-123"
  }
}

Response:
{
  "jsonrpc": "2.0",
  "id": "req-124",
  "result": {
    "taskId": "task-abc-123",
    "status": "COMPLETED",
    "artifact": {
      "contentType": "application/json",
      "content": {
        "riskScore": 85,
        "recommendation": "lock_card"
      }
    }
  }
}
```

**Method: `message/send`**
```json
Request:
{
  "jsonrpc": "2.0",
  "id": "req-125",
  "method": "message/send",
  "params": {
    "taskId": "task-abc-123",
    "parts": [
      {
        "type": "text",
        "content": "Please provide more details about the customer's travel history"
      }
    ]
  }
}

Response:
{
  "jsonrpc": "2.0",
  "id": "req-125",
  "result": {
    "messageId": "msg-xyz-789",
    "status": "sent"
  }
}
```

---

## ⭐ Core Features (V2)

### 1. Agent Discovery System
**User Story:** As an orchestrator agent, I want to discover available specialist agents so I can delegate tasks appropriately.

**Features:**
- **Agent Registry**: Central registry of all available agents
- **Agent Card Repository**: Store and serve Agent Cards
- **Discovery API**: Query agents by capability
- **Health Checks**: Monitor agent availability

**Implementation:**
```typescript
// Agent Discovery Service
class AgentDiscoveryService {
  private agentRegistry: Map<string, AgentCard>;
  
  async discoverAgents(): Promise<AgentCard[]> {
    // Fetch agent cards from all registered agents
    // Parse capabilities and skills
    // Return available agents
  }
  
  async findAgentBySkill(skill: string): Promise<AgentCard | null> {
    // Find agent that has the specified skill
  }
  
  async findAgentsByCapability(capability: string): Promise<AgentCard[]> {
    // Find all agents with specified capability
  }
}
```

---

### 2. Task Delegation & Management
**User Story:** As an orchestrator agent, I want to delegate tasks to specialist agents and track their completion.

**Features:**
- **Task Creation**: Create task for remote agent
- **Task Tracking**: Monitor task status
- **Task Cancellation**: Cancel in-progress tasks
- **Timeout Handling**: Handle long-running tasks
- **Result Retrieval**: Get task artifacts

**Workflow Example:**
```
User: "Is transaction TXN998877 fraudulent?"

Orchestrator Agent:
1. Discovers Fraud Detection Agent
2. Creates task: analyze_transaction(TXN998877)
3. Sends task to Fraud Agent via A2A
4. Polls for task status
5. Retrieves artifact when complete
6. Responds to user: "Risk score: 85/100. Recommendation: Lock card."
```

---

### 3. Multi-Agent Collaboration
**User Story:** As an orchestrator, I want to coordinate multiple agents working on related tasks.

**Features:**
- **Parallel Execution**: Run multiple tasks simultaneously
- **Sequential Workflows**: Chain agent tasks
- **Data Passing**: Pass results between agents
- **Conflict Resolution**: Handle conflicting recommendations

**Example Workflow:**
```
User: "Handle suspicious transaction TXN998877"

Orchestrator:
1. Task → Fraud Agent: analyze_transaction(TXN998877)
   Result: {riskScore: 85, recommendation: "lock_card"}

2. Task → Compliance Agent: check_compliance("lock_card", {...})
   Result: {compliant: true}

3. Task → Card Control Agent: lock_card(CARD789012, "fraud_detected")
   Result: {success: true, lockedAt: "..."}

4. Task → Customer Service Agent: create_notification(CUST123, "card_locked_fraud")
   Result: {notificationSent: true}

Response to User: "Transaction flagged as high risk (85/100). 
                   Card has been locked and customer notified."
```

---

### 4. Agent Communication Protocol
**User Story:** As a remote agent, I want to communicate with client agents using standardized messages.

**Features:**
- **Message Exchange**: Send/receive messages within task context
- **Content Types**: Support text, JSON, images, etc.
- **Streaming**: Stream partial results for long-running tasks
- **Error Handling**: Standardized error responses

**Message Types:**
- **Request for Information**: Agent asks another for data
- **Status Update**: Progress updates
- **Result**: Final output
- **Error**: Something went wrong
- **Clarification**: Agent needs more info

---

### 5. Orchestrator Intelligence
**User Story:** As an orchestrator agent, I want to intelligently route requests to the most appropriate specialist agent.

**Features:**
- **Intent Recognition**: Understand what user wants
- **Agent Selection**: Choose best agent for task
- **Load Balancing**: Distribute work across agents
- **Fallback Handling**: Handle agent unavailability
- **Context Awareness**: Maintain conversation context

**LLM-Powered Routing:**
```
User Query: "There's a weird charge from China on my card"

Orchestrator LLM Analysis:
- Intent: Report suspicious transaction
- Required Agents: Fraud Detection, Card Control
- Workflow: Analyze first, then act based on result
- Selected Agent: Fraud Detection Agent
- Skill: analyze_transaction
```

---

### 6. A2A Server Infrastructure
**User Story:** As a specialist agent, I want to expose my capabilities via A2A protocol.

**Features:**
- **Agent Card Endpoint**: Serve agent card at `/.well-known/agent.json`
- **Task Submission**: Accept task requests
- **Task Status**: Provide task status
- **Task Streaming**: Stream results for long tasks
- **Authentication**: Validate requests
- **Rate Limiting**: Prevent abuse

**A2A Server Template:**
```typescript
class A2AServer {
  private agentCard: AgentCard;
  private taskManager: TaskManager;
  
  // Serve agent card
  async getAgentCard(): Promise<AgentCard> {
    return this.agentCard;
  }
  
  // Handle task submission
  async submitTask(skill: string, parameters: any): Promise<Task> {
    // Validate skill exists
    // Create task
    // Execute skill asynchronously
    // Return task
  }
  
  // Get task status
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    return this.taskManager.getStatus(taskId);
  }
  
  // Stream task progress
  async streamTask(taskId: string): AsyncIterator<TaskUpdate> {
    // Server-sent events
  }
}
```

---

## 🏗️ Technical Architecture

### Technology Stack (V2)

**A2A Infrastructure:**
- **Protocol**: JSON-RPC 2.0 over HTTP(S)
- **Transport**: Express.js + SSE (Server-Sent Events)
- **Agent Framework**: Google ADK or custom implementation
- **Discovery**: Agent Registry Service
- **Task Queue**: Bull (Redis-based queue)

**Agent Implementation:**
- **Orchestrator**: Node.js + Claude/GPT-4 + A2A Client SDK
- **Specialist Agents**: Node.js + Specialized LLMs + A2A Server SDK
- **MCP Integration**: Existing MCP client for tool access

**Data Storage:**
- **PostgreSQL**: Agent registry, task history
- **Redis**: Task queue, caching, real-time data

### System Components

#### 1. **A2A Client SDK**
```typescript
// Used by Orchestrator to call remote agents
class A2AClient {
  async discoverAgent(agentId: string): Promise<AgentCard>;
  async submitTask(agentId: string, skill: string, params: any): Promise<Task>;
  async getTaskStatus(agentId: string, taskId: string): Promise<TaskStatus>;
  async streamTask(agentId: string, taskId: string): AsyncIterator<TaskUpdate>;
  async sendMessage(agentId: string, taskId: string, message: Message): Promise<void>;
}
```

#### 2. **A2A Server SDK**
```typescript
// Used by Specialist Agents to expose capabilities
class A2AServer {
  constructor(agentCard: AgentCard, skillHandlers: Map<string, SkillHandler>);
  async start(port: number): Promise<void>;
  async stop(): Promise<void>;
}
```

#### 3. **Agent Registry Service**
```typescript
// Central registry of all agents
class AgentRegistry {
  async registerAgent(agentCard: AgentCard): Promise<void>;
  async unregisterAgent(agentId: string): Promise<void>;
  async getAgent(agentId: string): Promise<AgentCard>;
  async listAgents(): Promise<AgentCard[]>;
  async findBySkill(skill: string): Promise<AgentCard[]>;
  async healthCheck(agentId: string): Promise<boolean>;
}
```

#### 4. **Task Manager**
```typescript
// Manages task lifecycle
class TaskManager {
  async createTask(task: Task): Promise<Task>;
  async updateTask(taskId: string, update: Partial<Task>): Promise<Task>;
  async getTask(taskId: string): Promise<Task>;
  async cancelTask(taskId: string): Promise<void>;
  async setArtifact(taskId: string, artifact: Artifact): Promise<void>;
}
```

---

## 📊 Database Schema (V2 Additions)

### agents
```sql
CREATE TABLE agents (
    agent_id VARCHAR(100) PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,        -- orchestrator, specialist
    specialization VARCHAR(50),             -- fraud, card_control, compliance, etc.
    version VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,            -- active, inactive, unhealthy
    endpoint_url VARCHAR(500) NOT NULL,
    agent_card_json JSON NOT NULL,
    last_health_check TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (agent_type),
    INDEX idx_specialization (specialization),
    INDEX idx_status (status)
);
```

### a2a_tasks
```sql
CREATE TABLE a2a_tasks (
    task_id VARCHAR(100) PRIMARY KEY,
    client_agent_id VARCHAR(100) NOT NULL,
    remote_agent_id VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    parameters JSON NOT NULL,
    status VARCHAR(20) NOT NULL,            -- PENDING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Task result
    artifact_id VARCHAR(100),
    artifact_content_type VARCHAR(100),
    artifact_content JSON,
    
    -- Error handling
    error_message TEXT,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,
    
    FOREIGN KEY (client_agent_id) REFERENCES agents(agent_id),
    FOREIGN KEY (remote_agent_id) REFERENCES agents(agent_id),
    INDEX idx_status (status),
    INDEX idx_client (client_agent_id),
    INDEX idx_remote (remote_agent_id),
    INDEX idx_created (created_at)
);
```

### a2a_messages
```sql
CREATE TABLE a2a_messages (
    message_id VARCHAR(100) PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL,
    from_agent_id VARCHAR(100) NOT NULL,
    to_agent_id VARCHAR(100) NOT NULL,
    message_type VARCHAR(50) NOT NULL,      -- request, response, notification, error
    parts JSON NOT NULL,                    -- Array of content parts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (task_id) REFERENCES a2a_tasks(task_id),
    INDEX idx_task (task_id),
    INDEX idx_created (created_at)
);
```

### agent_skills
```sql
CREATE TABLE agent_skills (
    skill_id SERIAL PRIMARY KEY,
    agent_id VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_description TEXT,
    parameters_schema JSON NOT NULL,
    returns_schema JSON NOT NULL,
    
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id),
    UNIQUE(agent_id, skill_name),
    INDEX idx_agent (agent_id),
    INDEX idx_skill_name (skill_name)
);
```

---

## 🎬 Demo Scenarios (V2)

### Scenario 1: Fraud Investigation Workflow
**Story:** Customer reports suspicious transaction, multiple agents collaborate to investigate and resolve.

**Demo Flow:**
1. User (bank employee) tells Orchestrator: "Transaction TXN998877 looks suspicious"

2. **Orchestrator** discovers and delegates:
   ```
   → Fraud Detection Agent: "analyze_transaction(TXN998877)"
   ```

3. **Fraud Agent** analyzes:
   - Checks transaction patterns
   - Calculates risk score: 92/100
   - Returns: "High fraud risk - Unusual location, high amount, velocity pattern"

4. **Orchestrator** asks Fraud Agent:
   ```
   → "What actions do you recommend?"
   → Response: "Lock card immediately, contact customer, file fraud report"
   ```

5. **Orchestrator** checks compliance:
   ```
   → Compliance Agent: "check_compliance('lock_card', {cardId: CARD789012})"
   → Response: "Compliant - proceed"
   ```

6. **Orchestrator** executes actions in parallel:
   ```
   → Card Control Agent: "lock_card(CARD789012, 'fraud_detected')"
   → Customer Service Agent: "create_notification(CUST123, 'fraud_alert')"
   ```

7. **Orchestrator** confirms to user:
   ```
   "Fraud investigation complete:
   - Risk Score: 92/100 (High)
   - Card ending in 9012 has been locked
   - Customer has been notified
   - Fraud report filed"
   ```

**Talking Points:**
- Multiple agents collaborating on complex workflow
- A2A task delegation and coordination
- Parallel execution for efficiency
- Specialized agent expertise

**Show in UI:**
- Visual diagram of agent collaboration
- Task flow visualization
- Real-time status updates
- Agent-to-agent messages

---

### Scenario 2: Agent Discovery & Dynamic Routing
**Story:** New agent added to ecosystem, orchestrator automatically discovers and uses it.

**Demo Flow:**
1. **Show Agent Registry** before:
   ```
   Available Agents:
   - Orchestrator Agent
   - Fraud Detection Agent
   - Card Control Agent
   - Customer Service Agent
   ```

2. **Deploy new Compliance Agent** (live during demo):
   ```bash
   # Deploy compliance agent
   # It publishes Agent Card at /.well-known/agent.json
   ```

3. **Orchestrator discovers new agent automatically**:
   ```
   Orchestrator: "Scanning for new agents..."
   Found: Compliance Agent (v1.0.0)
   Skills: check_compliance, aml_screen, kyc_verify
   Registered: ✓
   ```

4. **User query that needs compliance**:
   ```
   User: "Can we approve this $50,000 wire transfer for customer CUST123?"
   ```

5. **Orchestrator intelligently routes**:
   ```
   Orchestrator thinks: "This needs compliance checking"
   Searches agents: findBySkill("check_compliance")
   Found: Compliance Agent
   Delegates: compliance_agent.check_compliance(...)
   ```

6. **Compliance Agent responds**:
   ```
   Result: "Compliant - KYC verified, AML clear, within limits"
   ```

**Talking Points:**
- Dynamic agent discovery via Agent Cards
- No code changes needed to add new agents
- Intelligent routing based on capabilities
- Scalable architecture

---

### Scenario 3: Multi-Agent Parallel Processing
**Story:** Complex operation requiring multiple agents working simultaneously.

**Demo Flow:**
1. User: "Generate a complete customer risk profile for CUST123456"

2. **Orchestrator** creates parallel tasks:
   ```
   [Parallel Execution Started]
   
   Task 1 → Fraud Agent: analyze_pattern(CUST123456, "90d")
   Task 2 → Card Control Agent: get_card_usage_stats(CUST123456)
   Task 3 → Customer Service Agent: get_customer_profile(CUST123456)
   Task 4 → Compliance Agent: aml_screen(CUST123456)
   ```

3. **Show real-time task status**:
   ```
   Task 1: IN_PROGRESS [=====>    ] 50%
   Task 2: COMPLETED   [==========] 100% ✓
   Task 3: COMPLETED   [==========] 100% ✓
   Task 4: IN_PROGRESS [======>   ] 60%
   ```

4. **All tasks complete**, orchestrator aggregates:
   ```
   Customer Risk Profile:
   
   Customer: John Doe (CUST123456)
   - Account Age: 5 years
   - Average Monthly Spending: $4,500
   
   Fraud Analysis:
   - Pattern: Normal
   - Anomalies: None
   - Risk Score: 12/100 (Low)
   
   Card Usage:
   - 3 active cards
   - No declined transactions (30d)
   - Controls: Standard
   
   Compliance:
   - KYC: Verified ✓
   - AML: Clear ✓
   - Watch List: Not present ✓
   
   Overall Risk: LOW
   ```

**Talking Points:**
- Parallel agent execution for speed
- Data aggregation from multiple sources
- Comprehensive analysis in seconds
- Scalable to many agents

---

### Scenario 4: Agent Conversation & Clarification
**Story:** Agent needs more information from another agent, back-and-forth communication.

**Demo Flow:**
1. User: "Should we approve this card application from Jane Smith?"

2. **Orchestrator** → **Compliance Agent**: 
   ```
   "check_compliance('new_card_application', {applicant: 'Jane Smith'})"
   ```

3. **Compliance Agent responds** (needs more info):
   ```
   Message: "I need the customer ID to perform AML screening"
   Status: AWAITING_INPUT
   ```

4. **Orchestrator** → **Customer Service Agent**:
   ```
   "search_customer('Jane Smith')"
   Response: "Found CUST789012"
   ```

5. **Orchestrator** → **Compliance Agent** (continued):
   ```
   Message: "Customer ID is CUST789012"
   ```

6. **Compliance Agent** completes task:
   ```
   Result: {
     compliant: true,
     kyc: "verified",
     aml: "clear",
     recommendation: "approve"
   }
   ```

7. **Orchestrator** → User:
   ```
   "Card application approved. Compliance checks passed."
   ```

**Talking Points:**
- Agent-to-agent communication
- Clarification and follow-up
- Context preservation across messages
- Natural conversation flow

---

## 🧪 Testing Strategy

### Unit Tests
- Agent Card parsing and validation
- JSON-RPC 2.0 request/response handling
- Task lifecycle management
- Message serialization/deserialization

### Integration Tests
- Agent discovery flow
- Task submission and completion
- Multi-agent workflows
- Error handling and retries

### A2A Protocol Compliance Tests
- Agent Card format compliance
- JSON-RPC 2.0 compliance
- Task management compliance
- Message format compliance

### End-to-End Tests
- All demo scenarios
- Agent collaboration workflows
- Parallel execution
- Error recovery

---

## 📅 Implementation Plan

### Phase 1: A2A Infrastructure (Week 1-2)
**Goal:** Build A2A protocol foundation

**Tasks:**
- Implement A2A Client SDK
- Implement A2A Server SDK
- Build Agent Registry Service
- Create Task Manager
- Setup database schema
- JSON-RPC 2.0 transport layer

**Deliverables:**
- Working A2A client/server SDKs
- Agent registry operational
- Task management working

---

### Phase 2: Convert Admin Agent to Orchestrator (Week 2-3)
**Goal:** Upgrade existing Admin Agent to orchestrator role

**Tasks:**
- Add agent discovery capability
- Implement task delegation logic
- Add A2A client integration
- Update LLM prompts for orchestration
- Maintain backward compatibility with MCP

**Deliverables:**
- Orchestrator agent functional
- Can discover and delegate to agents
- Still supports direct MCP operations

---

### Phase 3: Build Specialist Agents (Week 3-5)
**Goal:** Create specialized agents

**Tasks:**
- Build Fraud Detection Agent
  - Implement fraud analysis skills
  - Create Agent Card
  - Setup A2A server
- Build Card Control Agent
  - Implement card operation skills
  - Create Agent Card
  - Setup A2A server
- Build Customer Service Agent
  - Implement customer info skills
  - Create Agent Card
  - Setup A2A server
- Build Compliance Agent
  - Implement compliance skills
  - Create Agent Card
  - Setup A2A server

**Deliverables:**
- 4 specialist agents fully functional
- All agents registered in registry
- All agents accessible via A2A

---

### Phase 4: Multi-Agent Workflows (Week 5-6)
**Goal:** Implement complex collaboration scenarios

**Tasks:**
- Parallel task execution
- Sequential workflows
- Agent-to-agent communication
- Data passing between agents
- Error handling and retries

**Deliverables:**
- Complex workflows operational
- Demo scenarios working
- Error handling robust

---

### Phase 5: UI & Demo Polish (Week 6-7)
**Goal:** Create compelling demo experience

**Tasks:**
- Agent activity visualization
- Task flow diagrams
- Real-time status updates
- Agent collaboration animation
- Demo script refinement

**Deliverables:**
- Polished demo UI
- All scenarios tested
- Demo script complete

---

## 📊 Success Metrics

### Technical Metrics
- Agent discovery time: <1 second
- Task delegation latency: <500ms
- Multi-agent workflow completion: <10 seconds
- A2A protocol compliance: 100%
- Agent uptime: >99%

### Demo Effectiveness
- Clearly demonstrates multi-agent collaboration
- Shows A2A protocol in action
- Highlights specialized agent value
- Proves scalability (add agent without code changes)
- Shows both MCP and A2A working together

### Business Value
- Faster complex operations (5-10x faster than manual)
- Modular agent architecture
- Easy to add new capabilities
- Improved accuracy with specialists
- Enhanced compliance and security

---

## 🛠️ Technology Stack

### A2A Implementation
- **Protocol**: JSON-RPC 2.0 over HTTP(S)
- **Transport**: Express.js + SSE
- **Agent Framework**: Custom or Google ADK
- **Task Queue**: Bull (Redis)
- **Discovery**: Agent Registry Service

### Agents
- **Orchestrator**: Node.js + Claude/GPT-4
- **Specialists**: Node.js + Specialized LLMs
- **Both**: A2A SDK + MCP Client

### Infrastructure
- **Backend**: Node.js + TypeScript
- **Database**: PostgreSQL + Redis
- **Hosting**: Existing Heroku/AWS/Azure
- **Monitoring**: Logging + metrics

---

## 📦 Deliverables

### Code
1. **A2A SDK** (client + server)
2. **Agent Registry Service**
3. **Orchestrator Agent V2**
4. **4 Specialist Agents**
5. **Agent Admin UI**

### Documentation
1. **A2A Protocol Guide**
2. **Agent Development Guide**
3. **API Documentation**
4. **Demo Script**
5. **Architecture Diagrams**

### Demo Assets
1. **Agent Visualization UI**
2. **5 Demo Scenarios**
3. **Agent Cards for all agents**
4. **Demo walkthrough video**

---

## 🚀 Out of Scope (Future Enhancements)

**V3 Potential Features:**
- Voice-enabled agents
- Multi-modal agents (image, video processing)
- Agent learning from interactions
- Agent marketplace
- Cross-organization agent collaboration
- Blockchain-based agent verification
- AI agent governance framework

---

## 🎯 Key Differentiators

What makes this V2 demo powerful:

1. **Industry First**: A2A protocol implementation for Financial Services
2. **Google Partnership**: Built on official A2A standard
3. **MCP + A2A**: Shows both protocols working together
4. **Multi-Agent**: Demonstrates agent collaboration at scale
5. **Modular**: Easy to add new specialized agents
6. **Real Workflows**: Solves actual banking operations
7. **MuleSoft Integration**: Shows full stack (APIs + Agents)

---

---

# 🛠️ BUILD INSTRUCTIONS FOR CURSOR

---

## 🚀 START HERE - PROMPT FOR CURSOR

**Copy and paste this prompt to Cursor to begin:**

```
Build A2A (Agent-to-Agent) Protocol support for the CMS ecosystem following 
the specifications in CMS_V2_A2A_Protocol_PRD.md.

CRITICAL REQUIREMENTS:
1. Create feature/v2-a2a branch (DO NOT touch master)
2. Implement Google's A2A Protocol (JSON-RPC 2.0 over HTTP)
3. Build A2A Client SDK and Server SDK
4. Convert existing Admin Agent to Orchestrator
5. Build 4 specialist agents (Fraud, Card Control, Customer Service, Compliance)
6. Each agent must publish Agent Card at /.well-known/agent.json
7. Implement task management and agent discovery
8. NO new Heroku Dynos - ask for existing app names
9. NO partial releases - only deploy when complete

BUILD ORDER:
Phase 1: A2A Infrastructure (Client SDK, Server SDK, Agent Registry, Task Manager)
Phase 2: Convert Admin Agent to Orchestrator
Phase 3: Build 4 Specialist Agents (each with Agent Card + A2A Server)
Phase 4: Multi-Agent Workflows (parallel execution, agent communication)
Phase 5: UI Visualization + Demo Polish

Key Technologies:
- JSON-RPC 2.0 over HTTP(S)
- Agent Cards at /.well-known/agent.json
- Task lifecycle management
- Bull queue (Redis) for async tasks
- Express.js for A2A servers

Start by creating the feature/v2-a2a branch and building the A2A SDK foundation.
Do NOT proceed to specialist agents until SDK and orchestrator are working.
```

---

## 🎯 OBJECTIVE

Implement Google's Agent-to-Agent (A2A) Protocol to enable multi-agent collaboration in the CMS ecosystem, transforming the single Admin Agent into an orchestrator that coordinates multiple specialized agents for complex banking operations.

---

## 🚨 CRITICAL CONSTRAINTS - READ FIRST

[Same constraints as previous PRDs]

### ⛔ CONSTRAINT 1: NO NEW HEROKU DYNOS
- Use existing Heroku infrastructure only
- Ask for existing app names before deployment

### ⛔ CONSTRAINT 2: NO PARTIAL RELEASES
- Only deploy when complete system works
- All agents must be functional together
- Zero console errors
- All demo scenarios tested

### 📋 MANDATORY PRE-DEPLOYMENT CHECKLIST

```
A2A PROTOCOL IMPLEMENTATION:
[ ] A2A Client SDK works
[ ] A2A Server SDK works
[ ] Agent Cards format correct
[ ] JSON-RPC 2.0 transport works
[ ] Task submission works
[ ] Task status checking works
[ ] Task streaming works (SSE)
[ ] Agent Registry operational
[ ] Task Manager operational

ORCHESTRATOR AGENT:
[ ] Agent discovery works
[ ] Task delegation works
[ ] LLM integration works
[ ] Can find agents by skill
[ ] Can create tasks
[ ] Can track task status
[ ] Can aggregate results
[ ] Context management works

SPECIALIST AGENTS:
[ ] Fraud Detection Agent works
[ ] Card Control Agent works
[ ] Customer Service Agent works
[ ] Compliance Agent works
[ ] All publish valid Agent Cards
[ ] All handle task submissions
[ ] All return proper artifacts
[ ] All integrate with MCP for tools

MULTI-AGENT WORKFLOWS:
[ ] Parallel execution works
[ ] Sequential workflows work
[ ] Agent-to-agent messages work
[ ] Data passing between agents works
[ ] Error handling works
[ ] Timeout handling works

DEMO SCENARIOS:
[ ] Scenario 1: Fraud Investigation
[ ] Scenario 2: Agent Discovery
[ ] Scenario 3: Parallel Processing
[ ] Scenario 4: Agent Conversation

DEPLOYMENT:
[ ] All agents deployed
[ ] Agent Registry accessible
[ ] Zero console errors
[ ] All integrations working
```

---

## 📁 PROJECT STRUCTURE

```
/
├── a2a-sdk/                      ← A2A Protocol SDK
│   ├── src/
│   │   ├── client/
│   │   │   └── A2AClient.ts
│   │   ├── server/
│   │   │   └── A2AServer.ts
│   │   ├── types/
│   │   │   ├── AgentCard.ts
│   │   │   ├── Task.ts
│   │   │   └── Message.ts
│   │   └── utils/
│   │       └── jsonrpc.ts
│   └── package.json
│
├── agent-registry/               ← Central agent registry
│   ├── src/
│   │   ├── registry.ts
│   │   ├── discovery.ts
│   │   └── health.ts
│   └── package.json
│
├── orchestrator-agent/           ← Main coordinator (upgraded from Admin Agent)
│   ├── src/
│   │   ├── orchestrator.ts
│   │   ├── agent-discovery.ts
│   │   ├── task-delegation.ts
│   │   └── llm-integration.ts
│   └── package.json
│
├── fraud-detection-agent/        ← Specialist agent
│   ├── src/
│   │   ├── agent.ts
│   │   ├── skills/
│   │   │   ├── analyze-transaction.ts
│   │   │   ├── analyze-pattern.ts
│   │   │   └── risk-score.ts
│   │   └── agent-card.json
│   ├── public/
│   │   └── .well-known/
│   │       └── agent.json
│   └── package.json
│
├── card-control-agent/           ← Specialist agent
│   ├── src/
│   │   ├── agent.ts
│   │   ├── skills/
│   │   │   ├── lock-card.ts
│   │   │   ├── unlock-card.ts
│   │   │   └── update-controls.ts
│   │   └── agent-card.json
│   ├── public/
│   │   └── .well-known/
│   │       └── agent.json
│   └── package.json
│
├── customer-service-agent/       ← Specialist agent
│   └── [similar structure]
│
├── compliance-agent/             ← Specialist agent
│   └── [similar structure]
│
├── agent-ui/                     ← Visualization UI
│   └── src/
│       ├── components/
│       │   ├── AgentDiagram.tsx
│       │   ├── TaskFlow.tsx
│       │   └── AgentStatus.tsx
│       └── App.tsx
│
└── docs/
    ├── A2A_PROTOCOL_GUIDE.md
    ├── AGENT_DEVELOPMENT.md
    └── DEMO_SCRIPT_V2.md
```

---

## 🔧 STEP 1: A2A SDK DEVELOPMENT

### Build A2A Client SDK

```typescript
// a2a-sdk/src/client/A2AClient.ts

export class A2AClient {
  private baseUrl: string;
  private authToken?: string;
  
  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }
  
  // Discover agent capabilities
  async discoverAgent(): Promise<AgentCard> {
    const response = await fetch(`${this.baseUrl}/.well-known/agent.json`);
    return response.json();
  }
  
  // Submit a task
  async submitTask(skill: string, parameters: any): Promise<Task> {
    const response = await this.jsonRpcRequest('task/submit', {
      skill,
      parameters,
      clientAgentId: 'orchestrator-agent'
    });
    return response.result;
  }
  
  // Get task status
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await this.jsonRpcRequest('task/status', { taskId });
    return response.result;
  }
  
  // Stream task progress
  async streamTask(taskId: string): AsyncIterator<TaskUpdate> {
    const eventSource = new EventSource(
      `${this.baseUrl}/a2a/task/${taskId}/stream`,
      { headers: { Authorization: `Bearer ${this.authToken}` }}
    );
    
    // Return async iterator
  }
  
  // Send message within task
  async sendMessage(taskId: string, message: Message): Promise<void> {
    await this.jsonRpcRequest('message/send', { taskId, ...message });
  }
  
  private async jsonRpcRequest(method: string, params: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/a2a/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: generateId(),
        method,
        params
      })
    });
    
    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    return result;
  }
}
```

### Build A2A Server SDK

```typescript
// a2a-sdk/src/server/A2AServer.ts

export class A2AServer {
  private agentCard: AgentCard;
  private skillHandlers: Map<string, SkillHandler>;
  private taskManager: TaskManager;
  private app: Express;
  
  constructor(agentCard: AgentCard, skillHandlers: Map<string, SkillHandler>) {
    this.agentCard = agentCard;
    this.skillHandlers = skillHandlers;
    this.taskManager = new TaskManager();
    this.app = express();
    this.setupRoutes();
  }
  
  private setupRoutes() {
    // Serve agent card
    this.app.get('/.well-known/agent.json', (req, res) => {
      res.json(this.agentCard);
    });
    
    // JSON-RPC endpoint
    this.app.post('/a2a/jsonrpc', async (req, res) => {
      const { method, params, id } = req.body;
      
      try {
        const result = await this.handleMethod(method, params);
        res.json({ jsonrpc: '2.0', id, result });
      } catch (error) {
        res.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: error.message
          }
        });
      }
    });
    
    // Task streaming
    this.app.get('/a2a/task/:taskId/stream', (req, res) => {
      // SSE implementation
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      this.taskManager.streamTask(req.params.taskId, res);
    });
  }
  
  private async handleMethod(method: string, params: any): Promise<any> {
    switch (method) {
      case 'task/submit':
        return await this.handleTaskSubmit(params);
      case 'task/status':
        return await this.handleTaskStatus(params);
      case 'message/send':
        return await this.handleMessageSend(params);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
  
  private async handleTaskSubmit(params: any): Promise<Task> {
    const { skill, parameters, clientAgentId } = params;
    
    // Validate skill exists
    if (!this.skillHandlers.has(skill)) {
      throw new Error(`Unknown skill: ${skill}`);
    }
    
    // Create task
    const task = await this.taskManager.createTask({
      skill,
      parameters,
      clientAgentId,
      remoteAgentId: this.agentCard.id
    });
    
    // Execute skill asynchronously
    this.executeSkill(task);
    
    return task;
  }
  
  private async executeSkill(task: Task) {
    try {
      const handler = this.skillHandlers.get(task.skill);
      const result = await handler(task.parameters);
      
      await this.taskManager.completeTask(task.taskId, result);
    } catch (error) {
      await this.taskManager.failTask(task.taskId, error.message);
    }
  }
  
  async start(port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`A2A Server running on port ${port}`);
    });
  }
}
```

---

## 🤖 STEP 2: BUILD SPECIALIST AGENTS

### Fraud Detection Agent Example

```typescript
// fraud-detection-agent/src/agent.ts

import { A2AServer, AgentCard } from '@a2a-sdk';
import { MCPClient } from '@mcp-client';

const agentCard: AgentCard = {
  id: 'fraud-detection-agent',
  name: 'Fraud Detection Specialist',
  description: 'Analyzes transactions and detects fraudulent patterns',
  version: '1.0.0',
  skills: [
    {
      name: 'analyze_transaction',
      description: 'Analyze a transaction for fraud indicators',
      parameters: {
        transactionId: { type: 'string', required: true }
      },
      returns: {
        riskScore: { type: 'number' },
        indicators: { type: 'array' },
        recommendation: { type: 'string' }
      }
    }
  ],
  endpoints: {
    task_submit: 'https://fraud-agent.example.com/a2a/task/submit',
    task_status: 'https://fraud-agent.example.com/a2a/task/{task_id}/status',
    task_stream: 'https://fraud-agent.example.com/a2a/task/{task_id}/stream'
  }
};

// Skill handlers
const skillHandlers = new Map();

skillHandlers.set('analyze_transaction', async (params) => {
  const { transactionId } = params;
  
  // Use MCP to get transaction data from CMS
  const mcp = new MCPClient(process.env.MCP_SERVER_URL);
  const transaction = await mcp.call('get_transaction_by_id', { transactionId });
  
  // Fraud detection logic (could use ML model)
  const riskScore = calculateRiskScore(transaction);
  const indicators = detectIndicators(transaction);
  const recommendation = generateRecommendation(riskScore, indicators);
  
  return {
    riskScore,
    indicators,
    recommendation
  };
});

skillHandlers.set('analyze_pattern', async (params) => {
  // Pattern analysis implementation
});

// Start A2A server
const server = new A2AServer(agentCard, skillHandlers);
server.start(3002);
```

---

## 🎯 STEP 3: BUILD ORCHESTRATOR

```typescript
// orchestrator-agent/src/orchestrator.ts

import { A2AClient } from '@a2a-sdk';
import Anthropic from '@anthropic-ai/sdk';

class OrchestratorAgent {
  private anthropic: Anthropic;
  private agentRegistry: Map<string, AgentCard>;
  private a2aClients: Map<string, A2AClient>;
  
  async processUserRequest(message: string, conversationHistory: any[]) {
    // 1. Discover available agents
    await this.discoverAgents();
    
    // 2. Use LLM to understand intent and select agents
    const plan = await this.createExecutionPlan(message);
    
    // 3. Execute plan (delegate to agents)
    const results = await this.executePlan(plan);
    
    // 4. Aggregate results and respond to user
    const response = await this.synthesizeResponse(results);
    
    return response;
  }
  
  private async discoverAgents() {
    // Fetch agent cards from registry
    // Create A2A clients for each agent
  }
  
  private async createExecutionPlan(message: string) {
    // Use LLM to determine which agents to invoke
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `
            Available agents and their skills:
            ${this.formatAgentCards()}
            
            User request: ${message}
            
            Create an execution plan specifying which agents to invoke,
            in what order, and with what parameters.
          `
        }
      ]
    });
    
    return this.parseExecutionPlan(response);
  }
  
  private async executePlan(plan: ExecutionPlan) {
    const results = [];
    
    for (const step of plan.steps) {
      if (step.parallel) {
        // Execute tasks in parallel
        const promises = step.tasks.map(task => this.delegateTask(task));
        const parallelResults = await Promise.all(promises);
        results.push(...parallelResults);
      } else {
        // Execute sequentially
        const result = await this.delegateTask(step.task);
        results.push(result);
      }
    }
    
    return results;
  }
  
  private async delegateTask(task: Task) {
    const client = this.a2aClients.get(task.agentId);
    
    // Submit task
    const submittedTask = await client.submitTask(task.skill, task.parameters);
    
    // Poll for completion
    while (true) {
      const status = await client.getTaskStatus(submittedTask.taskId);
      
      if (status.status === 'COMPLETED') {
        return status.artifact;
      } else if (status.status === 'FAILED') {
        throw new Error(status.error);
      }
      
      await sleep(1000);
    }
  }
}
```

---

## ✅ ACCEPTANCE CRITERIA

**V2 A2A Implementation is complete when:**

### A2A Protocol
- [ ] JSON-RPC 2.0 transport works
- [ ] Agent Cards valid and parseable
- [ ] Task lifecycle works (submit, status, complete)
- [ ] Message exchange works
- [ ] SSE streaming works

### Agents
- [ ] Orchestrator discovers agents
- [ ] Orchestrator delegates tasks
- [ ] Fraud Detection Agent works
- [ ] Card Control Agent works
- [ ] Customer Service Agent works
- [ ] Compliance Agent works

### Multi-Agent Workflows
- [ ] Parallel execution works
- [ ] Sequential workflows work
- [ ] Agent communication works
- [ ] Data passing works

### Demo Scenarios
- [ ] All 4 scenarios work end-to-end
- [ ] UI visualization shows agent collaboration
- [ ] Real-time status updates work

### Quality
- [ ] Zero console errors
- [ ] All integrations working
- [ ] MCP + A2A working together
- [ ] Complete documentation

---

## 🎉 FINAL NOTES

**This V2 adds powerful multi-agent capabilities to your CMS demo!**

Key innovations:
- ✅ Google A2A Protocol implementation
- ✅ Multi-agent collaboration
- ✅ Specialized agent expertise
- ✅ Dynamic agent discovery
- ✅ Complex workflow orchestration
- ✅ MCP + A2A working together

**Ready to showcase the future of AI agents in Financial Services!** 🚀

---

Good luck building V2! 🤖🤖🤖
