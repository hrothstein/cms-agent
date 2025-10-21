# CMS Admin Agent - Product Requirements Document

## 🎯 Executive Summary

A conversational AI agent that provides bank employees with a natural language interface to manage customers and cards in the Card Management System (CMS). The agent uses the MCP (Model Context Protocol) server to access admin operations, enabling bank staff to perform administrative tasks through simple conversational commands.

**System Architecture:**
```
┌─────────────────────────┐
│  Bank Employee          │  ← Admin User
│  (CSR, Operations)      │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Admin Agent UI         │  ← Chat Interface (React)
│  (Conversational)       │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Agent Backend          │  ← Node.js + LLM Integration
│  (Claude/GPT)           │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  MCP Server             │  ← Protocol Layer
│  https://hbr-flextest-  │
│  dl2x0l.8hm1bl.usa-e2.  │
│  cloudhub.io/cms/       │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  CMS Backend APIs       │  ← Card Management System
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Database               │  ← PostgreSQL
└─────────────────────────┘
```

---

## 📋 Problem Statement

Bank employees need to perform administrative tasks in the CMS (viewing customers, creating cards, updating information), but requiring them to use traditional UI forms and multiple screens is time-consuming. A conversational agent allows staff to:
- Execute admin tasks through natural language
- Quickly access customer and card information
- Perform bulk operations efficiently
- Reduce training time for new employees
- Increase operational productivity

---

## 🎯 Goals & Objectives

**Primary Goal:** Demonstrate conversational AI for banking operations using MCP integration

**Demo Objectives:**
1. Showcase natural language interface for admin operations
2. Demonstrate MCP protocol integration with CMS
3. Show AI-powered banking operations assistant
4. Highlight operational efficiency gains
5. Prove conversational AI value for Financial Services

---

## 👥 User Personas

**1. Customer Service Representative (Lisa - Primary User)**
- Age: 28, works at bank call center
- Needs to quickly look up customer information
- Helps customers with card issues
- Performs card operations (lock, create, update)
- Values speed and ease of use
- Handles 50+ customer calls per day

**2. Bank Operations Manager (Michael - Secondary User)**
- Age: 42, manages operations team
- Reviews customer accounts
- Bulk card operations
- Customer data management
- Reports and analytics needs
- Oversees compliance and accuracy

**3. Solutions Engineer (You - Demo Presenter)**
- Showcases conversational AI capabilities
- Demonstrates MCP integration
- Shows operational efficiency improvements
- Highlights MuleSoft/Salesforce value proposition

---

## 🔌 MCP Server Integration

### MCP Endpoint
```
https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/
```

### Available Tools (10 Total)

#### Customer Management Tools (5)

| Tool | Description | Parameters | Returns |
|------|-------------|------------|---------|
| `get_all_customers` | Get all customers in system | None | Array of customer objects |
| `get_customer_by_id` | Get specific customer details | `customerId: string` | Customer object |
| `create_customer` | Create new customer | `name: string`<br>`email: string`<br>`phone: string` | Created customer object |
| `update_customer` | Update customer information | `customerId: string`<br>`name: string`<br>`email: string`<br>`phone: string` | Updated customer object |
| `delete_customer` | Delete customer from system | `customerId: string` | Success/error message |

#### Card Management Tools (5)

| Tool | Description | Parameters | Returns |
|------|-------------|------------|---------|
| `get_all_cards` | Get all cards in system | None | Array of card objects |
| `get_card_by_id` | Get specific card details | `cardId: string` | Card object |
| `create_card` | Create new card for customer | `customerId: string`<br>`cardNumber: string`<br>`cardType: string`<br>`expiryDate: string` | Created card object |
| `update_card` | Update card information | `cardId: string`<br>`cardNumber: string`<br>`cardType: string`<br>`expiryDate: string` | Updated card object |
| `delete_card` | Delete card from system | `cardId: string` | Success/error message |

### MCP Connection Requirements
- HTTP/HTTPS connection to MCP server
- Authentication (if required by MCP server)
- JSON request/response format
- Error handling for failed connections
- Timeout handling

---

## ⭐ Core Features (MVP Scope)

### 1. Conversational Interface
**User Story:** As a bank employee, I want to interact with the system using natural language so I can work more efficiently.

**Features:**
- Chat-style interface (like ChatGPT)
- Text input field
- Conversation history
- Message bubbles (user vs agent)
- Typing indicator while agent processes
- Clear conversation button

**Example Interactions:**
```
User: "Show me all customers"
Agent: "I found 247 customers in the system. Here are the first 10:
       1. John Doe (john.doe@example.com)
       2. Sarah Smith (sarah.smith@example.com)
       ..."

User: "Get customer details for CUST123456"
Agent: "Here are the details for customer CUST123456:
       Name: John Doe
       Email: john.doe@example.com
       Phone: +1-555-123-4567
       Customer ID: CUST123456"

User: "Create a new card for this customer"
Agent: "I can create a new card for John Doe (CUST123456). 
       I need:
       - Card number
       - Card type (debit/credit)
       - Expiry date
       Please provide these details."
```

---

### 2. Customer Management Operations
**User Story:** As a bank employee, I want to manage customer information through conversation.

**Supported Operations:**

**A. View All Customers**
```
User: "Show me all customers"
User: "List all customers"
User: "Get customer list"
```
→ Calls `get_all_customers`
→ Displays formatted list with key info

**B. Search/View Specific Customer**
```
User: "Get customer CUST123456"
User: "Show me details for customer ID CUST123456"
User: "Look up customer CUST123456"
```
→ Calls `get_customer_by_id`
→ Displays full customer details

**C. Create New Customer**
```
User: "Create a new customer"
User: "Add customer John Smith, email john@example.com, phone 555-1234"
```
→ Collects required info (name, email, phone)
→ Calls `create_customer`
→ Confirms creation with new customer ID

**D. Update Customer Information**
```
User: "Update customer CUST123456 email to newemail@example.com"
User: "Change phone for CUST123456 to 555-9999"
```
→ Calls `update_customer`
→ Confirms update

**E. Delete Customer**
```
User: "Delete customer CUST123456"
User: "Remove customer CUST123456"
```
→ Asks for confirmation (safety check)
→ Calls `delete_customer`
→ Confirms deletion

---

### 3. Card Management Operations
**User Story:** As a bank employee, I want to manage cards through conversation.

**Supported Operations:**

**A. View All Cards**
```
User: "Show me all cards"
User: "List all cards in the system"
User: "Get all cards"
```
→ Calls `get_all_cards`
→ Displays formatted list with card info

**B. Search/View Specific Card**
```
User: "Get card CARD789012"
User: "Show me details for card CARD789012"
User: "Look up card CARD789012"
```
→ Calls `get_card_by_id`
→ Displays full card details

**C. Create New Card**
```
User: "Create a card for customer CUST123456"
User: "Add a new debit card for CUST123456, number 4532123456784567, expires 12/2026"
```
→ Collects required info (customerId, cardNumber, cardType, expiryDate)
→ Calls `create_card`
→ Confirms creation with new card ID

**D. Update Card Information**
```
User: "Update card CARD789012 expiry date to 12/2027"
User: "Change card type for CARD789012 to credit"
```
→ Calls `update_card`
→ Confirms update

**E. Delete Card**
```
User: "Delete card CARD789012"
User: "Remove card CARD789012"
```
→ Asks for confirmation (safety check)
→ Calls `delete_card`
→ Confirms deletion

---

### 4. Contextual Understanding
**User Story:** As a bank employee, I want the agent to remember context so I don't have to repeat information.

**Features:**
- Maintains conversation context
- Remembers last customer/card referenced
- Supports follow-up questions
- Handles pronouns and references

**Example:**
```
User: "Get customer CUST123456"
Agent: "Here are the details for John Doe..."

User: "Show me their cards"
Agent: [remembers CUST123456] "John Doe has 2 cards:
       1. Card ending in 4567 (Debit)
       2. Card ending in 8901 (Credit)"

User: "Create a new card for them"
Agent: [remembers CUST123456] "I'll create a new card for John Doe..."
```

---

### 5. Help & Guidance
**User Story:** As a bank employee, I want help understanding what the agent can do.

**Features:**
- Help command
- Example queries
- Available operations list
- Clarification requests

**Example:**
```
User: "help"
Agent: "I can help you manage customers and cards. Here's what I can do:

       Customer Management:
       - View all customers
       - Get customer details
       - Create new customer
       - Update customer info
       - Delete customer

       Card Management:
       - View all cards
       - Get card details
       - Create new card
       - Update card info
       - Delete card

       Try asking things like:
       - 'Show me all customers'
       - 'Get customer CUST123456'
       - 'Create a card for customer CUST123456'
       - 'Update card CARD789012 expiry to 12/2027'"
```

---

### 6. Error Handling
**User Story:** As a bank employee, I want clear error messages when something goes wrong.

**Features:**
- Handles MCP server errors gracefully
- Validates user input before calling tools
- Provides helpful error messages
- Suggests corrections

**Example:**
```
User: "Get customer ABC123"
Agent: "I couldn't find customer with ID 'ABC123'. 
       Customer IDs typically start with 'CUST'. 
       Did you mean 'CUST123'? Or you can say 'show all customers' to see the list."

User: "Create a card"
Agent: "To create a card, I need:
       - Customer ID
       - Card number (16 digits)
       - Card type (debit or credit)
       - Expiry date (MM/YYYY)
       
       Please provide these details or say 'cancel' to abort."
```

---

### 7. Confirmation for Destructive Actions
**User Story:** As a bank employee, I want confirmation before deleting data to prevent mistakes.

**Features:**
- Confirmation prompt for delete operations
- Cancel option
- Clear indication of what will be deleted

**Example:**
```
User: "Delete customer CUST123456"
Agent: "⚠️ Are you sure you want to delete customer CUST123456?
       
       Customer: John Doe
       Email: john.doe@example.com
       
       This action cannot be undone. Type 'confirm' to proceed or 'cancel' to abort."

User: "confirm"
Agent: "Customer CUST123456 (John Doe) has been deleted successfully."
```

---

## 🎨 UI/UX Requirements

### Design Principles
- **Simple & Clean:** Focus on conversation, minimal distractions
- **Professional:** Banking-appropriate design
- **Fast:** Quick responses, minimal latency
- **Clear:** Easy to read messages and data
- **Accessible:** Keyboard navigation, screen reader friendly

### Layout

**Main Chat Interface:**
```
┌─────────────────────────────────────────────┐
│  CMS Admin Agent              [Clear] [?]   │  ← Header
├─────────────────────────────────────────────┤
│                                             │
│  Agent: Hello! I'm your CMS admin          │
│         assistant. I can help you manage   │
│         customers and cards. What would    │
│         you like to do?                    │
│                                             │
│                      User: Show all cards  │  ← User messages (right)
│                                             │
│  Agent: I found 156 cards in the system.   │  ← Agent messages (left)
│         Here are the first 10:             │
│                                             │
│         [Card list displayed here]         │
│                                             │
│  [Agent is typing...]                      │  ← Typing indicator
│                                             │
├─────────────────────────────────────────────┤
│  Type your message...              [Send]  │  ← Input area
└─────────────────────────────────────────────┘
```

### Visual Design
- **Color Scheme:**
  - Primary: Professional blue (#1E40AF)
  - Agent messages: Light gray background (#F3F4F6)
  - User messages: Blue background (#3B82F6)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Error: Red (#EF4444)

- **Typography:**
  - Headings: Inter Bold
  - Body: Inter Regular
  - Code/IDs: Monospace (SF Mono)

- **Components:**
  - Rounded message bubbles
  - Avatar icons (robot for agent, user icon for human)
  - Smooth scroll animation
  - Loading dots animation
  - Timestamp on messages

### Data Display Formatting

**Customer List:**
```
Found 247 customers:

1. John Doe
   ID: CUST123456
   Email: john.doe@example.com
   Phone: +1-555-123-4567

2. Sarah Smith
   ID: CUST123457
   Email: sarah.smith@example.com
   Phone: +1-555-234-5678

[Show more...]
```

**Card List:**
```
Found 156 cards:

1. Card ending in 4567
   Card ID: CARD789012
   Type: Debit
   Customer: John Doe (CUST123456)
   Expires: 12/2026
   Status: Active

2. Card ending in 8901
   Card ID: CARD789013
   Type: Credit
   Customer: Sarah Smith (CUST123457)
   Expires: 08/2027
   Status: Active

[Show more...]
```

---

## 🏗️ Technical Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React Markdown for formatting agent responses
- WebSocket or polling for real-time updates (optional)

**Backend:**
- Node.js 20 LTS
- Express.js
- TypeScript
- LLM Integration:
  - Anthropic Claude API (recommended) OR
  - OpenAI GPT-4 API
- MCP Client library (for connecting to MCP server)

**Integration:**
- MCP Server at `https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/`
- HTTP/REST communication
- JSON data format

### System Flow

**1. User sends message:**
```
User Input → Frontend → Backend Agent
```

**2. Agent processes with LLM:**
```
Backend Agent → LLM (Claude/GPT)
             → Determines intent
             → Selects MCP tool
             → Extracts parameters
```

**3. Agent calls MCP tool:**
```
Backend Agent → MCP Client → MCP Server → CMS Backend → Database
```

**4. Agent receives response:**
```
MCP Server → Backend Agent → Formats response → LLM generates natural language
```

**5. Response sent to user:**
```
Backend Agent → Frontend → Display to User
```

### Agent Logic Architecture

**Conversational AI Layer:**
- Uses Claude or GPT-4 as the "brain"
- Provides LLM with:
  - System prompt (role, capabilities, tools available)
  - Conversation history
  - Available MCP tools and their schemas
- LLM decides which tool to call and with what parameters
- LLM formats responses naturally

**Tool Integration Layer:**
- Maps LLM tool calls to MCP server calls
- Validates parameters
- Handles authentication
- Error handling and retries
- Response formatting

**Example System Prompt:**
```
You are an admin assistant for a Card Management System. You help bank employees 
manage customers and cards through natural language conversation.

You have access to these tools via MCP:

Customer Management:
- get_all_customers: Get list of all customers
- get_customer_by_id(customerId): Get specific customer details
- create_customer(name, email, phone): Create new customer
- update_customer(customerId, name, email, phone): Update customer info
- delete_customer(customerId): Delete customer

Card Management:
- get_all_cards: Get list of all cards
- get_card_by_id(cardId): Get specific card details
- create_card(customerId, cardNumber, cardType, expiryDate): Create new card
- update_card(cardId, cardNumber, cardType, expiryDate): Update card info
- delete_card(cardId): Delete card

Guidelines:
- Be helpful and professional
- Always confirm before destructive actions (delete)
- Format data clearly and concisely
- Ask for clarification when needed
- Maintain conversation context
```

---

## 🔐 Security & Authentication

### User Authentication
- Agent UI requires login (bank employee credentials)
- Session management with JWT
- Role-based access control (RBAC)
  - CSR role: Read-only + create operations
  - Admin role: Full CRUD operations

### MCP Server Authentication
- API key or OAuth token for MCP server
- Secure credential storage (environment variables)
- HTTPS only communication

### Audit Logging
- Log all agent actions (who did what, when)
- Log all MCP tool calls
- User action tracking
- Compliance requirements

### Data Security
- No storage of sensitive data in agent
- All data comes from MCP/CMS
- Encrypted communication (TLS 1.3)
- Input sanitization

---

## 📊 Database Schema

**Note:** The agent does NOT have its own database for customer/card data. All data is accessed via MCP server. 

**Agent-specific data storage (minimal):**

### conversation_history
```sql
CREATE TABLE conversation_history (
    conversation_id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,          -- Bank employee ID
    session_id VARCHAR(100) NOT NULL,
    message_role VARCHAR(20) NOT NULL,     -- 'user' or 'agent'
    message_content TEXT NOT NULL,
    mcp_tool_called VARCHAR(50),           -- Tool name if agent called one
    mcp_tool_params JSON,                  -- Parameters used
    mcp_tool_response JSON,                -- Response from MCP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
);
```

### agent_audit_log
```sql
CREATE TABLE agent_audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,      -- VIEW, CREATE, UPDATE, DELETE
    entity_type VARCHAR(50) NOT NULL,      -- CUSTOMER, CARD
    entity_id VARCHAR(50),
    mcp_tool VARCHAR(50) NOT NULL,
    mcp_params JSON,
    mcp_response JSON,
    success BOOLEAN,
    error_message TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);
```

---

## 🔌 API Specifications

### Agent Backend API

**Base URL:** `http://localhost:3001/api/v1`

#### POST /chat/message
Send a message to the agent

```json
Request:
{
  "sessionId": "sess_abc123xyz",
  "message": "Show me all customers"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "agentResponse": "I found 247 customers in the system. Here are the first 10:\n\n1. John Doe...",
    "toolCalled": "get_all_customers",
    "toolParams": {},
    "toolResponse": { /* MCP response data */ },
    "timestamp": "2024-10-21T15:30:00Z"
  }
}
```

#### GET /chat/history/:sessionId
Get conversation history for a session

```json
Response: 200 OK
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "messages": [
      {
        "role": "agent",
        "content": "Hello! I'm your CMS admin assistant...",
        "timestamp": "2024-10-21T15:25:00Z"
      },
      {
        "role": "user",
        "content": "Show me all customers",
        "timestamp": "2024-10-21T15:25:30Z"
      },
      {
        "role": "agent",
        "content": "I found 247 customers...",
        "timestamp": "2024-10-21T15:25:32Z"
      }
    ]
  }
}
```

#### DELETE /chat/history/:sessionId
Clear conversation history

```json
Response: 200 OK
{
  "success": true,
  "message": "Conversation history cleared"
}
```

#### GET /chat/capabilities
Get agent capabilities (for help/documentation)

```json
Response: 200 OK
{
  "success": true,
  "data": {
    "tools": [
      {
        "name": "get_all_customers",
        "description": "Get all customers in system",
        "parameters": []
      },
      {
        "name": "get_customer_by_id",
        "description": "Get specific customer details",
        "parameters": ["customerId"]
      }
      // ... all 10 tools
    ],
    "examples": [
      "Show me all customers",
      "Get customer CUST123456",
      "Create a card for customer CUST123456"
    ]
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- MCP client connection
- Tool parameter validation
- Response formatting
- Error handling

### Integration Tests
- End-to-end tool calls to MCP server
- LLM integration (with mock responses)
- Conversation flow testing
- Context retention

### UI Tests
- Chat interface rendering
- Message display
- Input/output handling
- Error message display

### Demo Testing
- Run through all demo scenarios
- Test each MCP tool at least once
- Verify conversation context works
- Check error handling

---

## 📅 Implementation Plan

### Phase 1: Foundation (Week 1)
**Goal:** Setup and basic chat interface

**Tasks:**
- Initialize frontend (React + TypeScript)
- Initialize backend (Node.js + Express)
- Setup basic chat UI (message display, input)
- Implement session management
- Setup conversation history storage
- Deploy skeleton to staging

**Deliverables:**
- Basic chat interface (no AI yet)
- Backend API for messages
- Session management working

---

### Phase 2: MCP Integration (Week 1-2)
**Goal:** Connect to MCP server and test tools

**Tasks:**
- Implement MCP client in backend
- Test connection to MCP server
- Test all 10 tools individually:
  - `get_all_customers`
  - `get_customer_by_id`
  - `create_customer`
  - `update_customer`
  - `delete_customer`
  - `get_all_cards`
  - `get_card_by_id`
  - `create_card`
  - `update_card`
  - `delete_card`
- Error handling for MCP calls
- Response formatting

**Deliverables:**
- MCP client working
- All 10 tools tested and functional
- Error handling in place

---

### Phase 3: LLM Integration (Week 2)
**Goal:** Add conversational AI

**Tasks:**
- Integrate Claude API or OpenAI GPT-4 API
- Create system prompt with tool definitions
- Implement function calling
- Map LLM tool calls to MCP tools
- Test conversational flows
- Context retention

**Deliverables:**
- LLM responds to messages
- LLM calls correct MCP tools
- Natural language responses generated
- Conversation context maintained

---

### Phase 4: Advanced Features (Week 3)
**Goal:** Polish and enhance

**Tasks:**
- Implement confirmation for delete operations
- Add help command
- Better data formatting in responses
- Loading states and animations
- Error message improvements
- Audit logging
- Authentication (basic)

**Deliverables:**
- Confirmation dialogs working
- Help system functional
- Professional data display
- Audit logs captured

---

### Phase 5: Testing & Demo Prep (Week 3)
**Goal:** Finalize demo

**Tasks:**
- End-to-end testing of all scenarios
- Demo script creation
- UI polish
- Performance optimization
- Documentation
- Final deployment

**Deliverables:**
- Complete working demo
- Demo script with scenarios
- Documentation
- Production deployment

---

## 🎬 Demo Scenarios

### Scenario 1: View All Customers
**Story:** Bank employee wants to see all customers in the system.

**Demo Flow:**
1. User types: "Show me all customers"
2. Agent processes request
3. Agent calls `get_all_customers` via MCP
4. Agent displays formatted list of customers
5. Show MCP call in logs

**Talking Points:**
- Natural language interface
- MCP integration
- Easy access to customer data
- No need to navigate UI forms

---

### Scenario 2: Create New Card for Customer
**Story:** Bank employee needs to issue a new card to existing customer.

**Demo Flow:**
1. User types: "Create a new debit card for customer CUST123456"
2. Agent asks for missing info: "I'll need the card number and expiry date"
3. User provides: "Card number 4532123456784567, expires 12/2026"
4. Agent calls `create_card` via MCP
5. Agent confirms: "Successfully created debit card ending in 4567 for John Doe"
6. Show new card ID and details

**Talking Points:**
- Conversational data collection
- Context awareness
- MCP tool orchestration
- Immediate feedback

---

### Scenario 3: Update Customer Information
**Story:** Customer moved and needs address update (via phone/email update).

**Demo Flow:**
1. User types: "Get customer CUST123456"
2. Agent displays customer details
3. User: "Update their email to john.newemail@example.com"
4. Agent calls `update_customer` via MCP
5. Agent confirms update with new details

**Talking Points:**
- Context retention (remembers customer from previous query)
- Quick updates without forms
- Real-time synchronization via MCP

---

### Scenario 4: Safe Delete with Confirmation
**Story:** Bank employee needs to delete a card after it's been permanently replaced.

**Demo Flow:**
1. User types: "Delete card CARD789012"
2. Agent shows warning: "⚠️ Are you sure you want to delete card CARD789012?"
3. Agent displays card details
4. Agent prompts: "Type 'confirm' to proceed or 'cancel' to abort"
5. User types: "confirm"
6. Agent calls `delete_card` via MCP
7. Agent confirms deletion

**Talking Points:**
- Safety mechanisms for destructive operations
- Prevent accidental deletions
- Clear confirmation process
- Audit trail

---

### Scenario 5: Help and Discovery
**Story:** New employee learns what the agent can do.

**Demo Flow:**
1. User types: "help"
2. Agent displays comprehensive help:
   - List of capabilities
   - Example queries
   - Available operations
3. User tries example: "Show me all cards"
4. Agent executes and displays results

**Talking Points:**
- Easy onboarding
- Self-service help
- Reduced training time
- Intuitive interface

---

## 📊 Success Metrics

### Technical Metrics
- Agent response time: <3 seconds
- MCP call success rate: >99%
- Conversation context accuracy: >95%
- Uptime: 99.9%

### Demo Effectiveness Metrics
- Demonstrates conversational AI for banking
- Shows MCP integration clearly
- Highlights operational efficiency
- Proves natural language understanding
- Shows proper error handling

### Business Value Metrics (for Prospects)
- Reduced training time for new employees
- Faster task completion (3-5x faster than UI)
- Higher employee satisfaction
- Lower error rates
- Improved operational efficiency

---

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Axios
- React Markdown (for formatting responses)
- date-fns (for timestamps)

### Backend
- Node.js 20 LTS
- Express.js
- TypeScript
- Anthropic Claude API or OpenAI API
- Axios (for MCP HTTP calls)
- PostgreSQL (for conversation history)

### Infrastructure
- Git + GitHub
- CI/CD: GitHub Actions
- Hosting: Heroku (existing), AWS, or Azure
- Monitoring: Logs and analytics

---

## 📦 Deliverables

### Code Repositories
1. **agent-frontend:** React chat interface
2. **agent-backend:** Node.js agent server with LLM integration

### Documentation
1. **Agent API Documentation:** Endpoints and usage
2. **User Guide:** How to use the agent
3. **MCP Integration Guide:** How agent connects to MCP
4. **Demo Script:** Step-by-step demo walkthrough
5. **System Architecture:** Diagrams and flows

### Deployment
1. **Staging Environment:** For testing
2. **Production Environment:** Demo environment
3. **Database Backups:** For conversation history

### Demo Assets
1. **Demo Data:** Pre-seeded customers/cards in CMS
2. **Demo Script:** Talking points for each scenario
3. **Demo Video:** Recorded walkthrough (optional)

---

## 🚀 Out of Scope (Future Enhancements)

**Not in MVP but can be added later:**

### Conversational Features
- Voice input/output
- Multi-language support
- Sentiment analysis
- Proactive suggestions
- Batch operations ("Create 5 cards for customer X")

### Integration Features
- Integration with other systems (fraud detection, etc.)
- Webhook notifications
- Email/SMS notifications
- Slack/Teams bot integration

### Advanced AI Features
- Learning from user feedback
- Custom training on bank-specific terms
- Predictive analytics
- Anomaly detection
- Auto-complete suggestions

### Admin Features
- Agent analytics dashboard
- Conversation analytics
- User performance metrics
- A/B testing different prompts

---

## 🎯 Key Differentiators for Demo

What makes this demo valuable for showcasing MuleSoft/Salesforce:

1. **Conversational AI:** Modern interface for banking operations
2. **MCP Integration:** Protocol-based integration (future-proof)
3. **Operational Efficiency:** Faster than traditional UI
4. **Easy Onboarding:** Natural language reduces training
5. **Extensibility:** Easy to add more tools/capabilities
6. **Salesforce Einstein:** Can position as Einstein-powered agent
7. **MuleSoft API-Led:** Shows clean API integration patterns

---

---

# 🛠️ BUILD INSTRUCTIONS FOR CURSOR

---

## 🚀 START HERE - PROMPT FOR CURSOR

**Copy and paste this prompt to Cursor to begin:**

```
Build a conversational AI admin agent following the specifications in CMS_Admin_Agent_PRD.md.

CRITICAL REQUIREMENTS:
1. Create feature/admin-agent branch (DO NOT touch master)
2. Test MCP connection FIRST before building anything else
3. MCP endpoint: https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/
4. Test all 10 MCP tools individually before proceeding
5. Integrate LLM (Claude or GPT-4) with function calling
6. Build chat UI (React + TypeScript)
7. NO new Heroku Dynos - ask for existing app names
8. NO partial releases - only deploy when complete

BUILD ORDER:
Phase 1: Create feature branch and test MCP connection (all 10 tools)
Phase 2: Build backend with LLM integration
Phase 3: Build frontend chat interface
Phase 4: Test end-to-end
Phase 5: Deploy to existing infrastructure

Start by creating the feature/admin-agent branch and testing the MCP connection.
Do NOT proceed until all 10 MCP tools are verified working.
```

---

## 🎯 OBJECTIVE

Build a conversational AI agent that provides bank employees with natural language access to CMS admin operations via MCP (Model Context Protocol) server. The agent uses LLM (Claude or GPT-4) to understand requests and call appropriate MCP tools.

---

## 🚨 CRITICAL CONSTRAINTS - READ FIRST

### ⛔ CONSTRAINT 1: NO NEW HEROKU DYNOS
**YOU ARE FORBIDDEN FROM CREATING NEW DYNOS IN HEROKU**

- Do NOT run `heroku create` commands
- Do NOT create new Heroku applications
- Use existing Heroku infrastructure only
- If deployment is needed, ask for existing Heroku app details
- Deploy to existing apps using `git push heroku feature/admin-agent:main`

**Why:** Cost control and infrastructure management. We work within existing resources.

**What to do:** Before deployment, ask the user: "What are the existing Heroku app names for the agent backend and frontend?"

---

### ⛔ CONSTRAINT 2: NO PARTIAL RELEASES
**YOU ARE FORBIDDEN FROM RELEASING INCOMPLETE OR NON-WORKING PRODUCTS**

```
┌─────────────────────────────────────────────┐
│  🚫 DO NOT DEPLOY IF:                       │
│  ❌ Frontend works but backend doesn't      │
│  ❌ Backend works but frontend doesn't      │
│  ❌ MCP connection not working              │
│  ❌ LLM integration not working             │
│  ❌ Console has errors                      │
│  ❌ Core workflows don't complete           │
│                                              │
│  ✅ ONLY DEPLOY WHEN:                       │
│  ✅ Frontend AND backend work together      │
│  ✅ MCP tools all tested and working        │
│  ✅ LLM responds correctly                  │
│  ✅ All demo scenarios work end-to-end      │
│  ✅ Zero console errors                     │
└─────────────────────────────────────────────┘
```

**Why:** We deliver complete, working systems. Partial releases damage credibility and user trust.

**What to do:** Keep working on `feature/admin-agent` branch until EVERYTHING works, then release once.

---

### 📋 MANDATORY PRE-DEPLOYMENT CHECKLIST

**Before you even THINK about deploying, complete this checklist:**

```
MCP INTEGRATION:
[ ] MCP client connects to https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/
[ ] get_all_customers works
[ ] get_customer_by_id works
[ ] create_customer works
[ ] update_customer works
[ ] delete_customer works
[ ] get_all_cards works
[ ] get_card_by_id works
[ ] create_card works
[ ] update_card works
[ ] delete_card works
[ ] Error handling works for failed MCP calls

LLM INTEGRATION:
[ ] Claude/GPT API key configured
[ ] LLM receives messages
[ ] LLM understands tool definitions
[ ] LLM calls correct tools
[ ] LLM formats responses naturally
[ ] Function calling works
[ ] Error handling for LLM failures

BACKEND FUNCTIONALITY:
[ ] Chat API endpoint works
[ ] Session management works
[ ] Message processing works
[ ] Tool mapping (LLM → MCP) works
[ ] Response formatting works
[ ] Conversation history storage works
[ ] No errors in backend logs

FRONTEND FUNCTIONALITY:
[ ] Chat UI renders correctly
[ ] Can send messages
[ ] Agent responses display
[ ] Typing indicator works
[ ] Message formatting works (markdown)
[ ] Clear conversation works
[ ] Help command works
[ ] Navigation works
[ ] No errors in browser console

INTEGRATION:
[ ] Frontend calls backend successfully
[ ] Backend calls MCP successfully
[ ] Backend calls LLM successfully
[ ] End-to-end message flow works
[ ] Real-time updates work

CONVERSATION FLOWS:
[ ] Can view all customers
[ ] Can get specific customer
[ ] Can create customer
[ ] Can update customer
[ ] Can delete customer (with confirmation)
[ ] Can view all cards
[ ] Can get specific card
[ ] Can create card
[ ] Can update card
[ ] Can delete card (with confirmation)
[ ] Context retention works
[ ] Help command works

QUALITY:
[ ] No console errors (frontend)
[ ] No log errors (backend)
[ ] Application looks professional
[ ] Messages format nicely
[ ] Loading states work
[ ] Error messages display appropriately

TESTING:
[ ] Tested all 10 MCP tools individually
[ ] Tested all demo scenarios successfully
[ ] Tested conversation context
[ ] Tested error handling
[ ] Tested on different screen sizes

DEPLOYMENT READINESS:
[ ] Environment variables configured (API keys)
[ ] MCP endpoint configured
[ ] Demo data exists in CMS
[ ] Documentation updated
[ ] NOT creating new Heroku Dynos (using existing)
```

**IF EVEN ONE BOX IS UNCHECKED, DO NOT DEPLOY. PERIOD.**

---

## ⚠️ CRITICAL: GIT BRANCHING STRATEGY

**DO THIS FIRST - BEFORE ANY CODE CHANGES!**

### Why We Need Branching
The CMS is separate from this agent. We build the agent on its own branch without touching CMS code.

### Branch Strategy

```
master (main)
  └── Your working CMS (if applicable) (PROTECTED)
  
feature/admin-agent
  └── New Agent development (SAFE TO BREAK)
```

### Step-by-Step Git Setup

1. **Create feature branch for Agent**
   ```bash
   git checkout -b feature/admin-agent
   git push -u origin feature/admin-agent
   ```

2. **Verify you're on the correct branch**
   ```bash
   git branch
   # Should show: * feature/admin-agent
   ```

3. **Set upstream tracking**
   ```bash
   git push --set-upstream origin feature/admin-agent
   ```

### Working on Feature Branch

**ALL Agent development happens on `feature/admin-agent` branch:**

```bash
# Make changes to code
git add .
git commit -m "feat: add chat interface"
git push origin feature/admin-agent

# Keep committing as you build features
git commit -m "feat: implement MCP client"
git push origin feature/admin-agent

git commit -m "feat: add LLM integration"
git push origin feature/admin-agent
```

---

## 📁 PROJECT STRUCTURE

Create this structure on the `feature/admin-agent` branch:

```
/
├── agent-backend/                ← Node.js/Express + LLM
│   ├── src/
│   │   ├── config/               ← Config (env, database)
│   │   ├── services/
│   │   │   ├── llm.service.ts    ← Claude/GPT integration
│   │   │   └── mcp.service.ts    ← MCP client
│   │   ├── routes/
│   │   │   └── chat.routes.ts    ← Chat endpoints
│   │   ├── controllers/
│   │   │   └── chat.controller.ts
│   │   ├── middleware/           ← Auth, validation
│   │   ├── utils/
│   │   └── app.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── agent-frontend/               ← React Chat UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── services/
│   │   │   └── api.ts            ← Backend API client
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO_SCRIPT.md
│
└── README.md
```

---

## 🔧 STEP 1: MCP CLIENT SETUP (Test First!)

### Initialize Backend

```bash
cd agent-backend
npm init -y
npm install express typescript ts-node @types/node @types/express
npm install axios dotenv cors
npm install --save-dev nodemon
```

### Test MCP Connection FIRST

**Create `src/services/mcp.service.ts`:**

```typescript
import axios from 'axios';

const MCP_BASE_URL = 'https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms';

export class MCPService {
  
  // Test all 10 tools
  
  async getAllCustomers() {
    const response = await axios.get(`${MCP_BASE_URL}/get_all_customers`);
    return response.data;
  }
  
  async getCustomerById(customerId: string) {
    const response = await axios.get(`${MCP_BASE_URL}/get_customer_by_id`, {
      params: { customerId }
    });
    return response.data;
  }
  
  async createCustomer(name: string, email: string, phone: string) {
    const response = await axios.post(`${MCP_BASE_URL}/create_customer`, {
      name, email, phone
    });
    return response.data;
  }
  
  async updateCustomer(customerId: string, name: string, email: string, phone: string) {
    const response = await axios.put(`${MCP_BASE_URL}/update_customer`, {
      customerId, name, email, phone
    });
    return response.data;
  }
  
  async deleteCustomer(customerId: string) {
    const response = await axios.delete(`${MCP_BASE_URL}/delete_customer`, {
      params: { customerId }
    });
    return response.data;
  }
  
  async getAllCards() {
    const response = await axios.get(`${MCP_BASE_URL}/get_all_cards`);
    return response.data;
  }
  
  async getCardById(cardId: string) {
    const response = await axios.get(`${MCP_BASE_URL}/get_card_by_id`, {
      params: { cardId }
    });
    return response.data;
  }
  
  async createCard(customerId: string, cardNumber: string, cardType: string, expiryDate: string) {
    const response = await axios.post(`${MCP_BASE_URL}/create_card`, {
      customerId, cardNumber, cardType, expiryDate
    });
    return response.data;
  }
  
  async updateCard(cardId: string, cardNumber: string, cardType: string, expiryDate: string) {
    const response = await axios.put(`${MCP_BASE_URL}/update_card`, {
      cardId, cardNumber, cardType, expiryDate
    });
    return response.data;
  }
  
  async deleteCard(cardId: string) {
    const response = await axios.delete(`${MCP_BASE_URL}/delete_card`, {
      params: { cardId }
    });
    return response.data;
  }
}
```

**Create test script `test-mcp.ts`:**

```typescript
import { MCPService } from './src/services/mcp.service';

async function testMCP() {
  const mcp = new MCPService();
  
  console.log('Testing MCP connection...\n');
  
  try {
    console.log('1. Testing get_all_customers...');
    const customers = await mcp.getAllCustomers();
    console.log('✓ Success:', customers);
    
    console.log('\n2. Testing get_all_cards...');
    const cards = await mcp.getAllCards();
    console.log('✓ Success:', cards);
    
    // Test other tools...
    
    console.log('\n✓ All MCP tools working!');
  } catch (error) {
    console.error('✗ MCP Error:', error);
  }
}

testMCP();
```

**Run test:**
```bash
npx ts-node test-mcp.ts
```

**DO NOT PROCEED until all 10 MCP tools are tested and working!**

---

## 🤖 STEP 2: LLM INTEGRATION

### Choose LLM Provider

**Option A: Anthropic Claude (Recommended)**
```bash
npm install @anthropic-ai/sdk
```

**Option B: OpenAI GPT-4**
```bash
npm install openai
```

### Create LLM Service

**Create `src/services/llm.service.ts`:**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { MCPService } from './mcp.service';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const mcp = new MCPService();

// Define tools for Claude
const tools = [
  {
    name: 'get_all_customers',
    description: 'Get all customers in the system',
    input_schema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_customer_by_id',
    description: 'Get specific customer details by ID',
    input_schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Customer ID (e.g., CUST123456)' }
      },
      required: ['customerId']
    }
  },
  // ... define all 10 tools
];

export class LLMService {
  
  async processMessage(message: string, conversationHistory: any[]) {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      tools: tools,
      messages: [
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      system: `You are a helpful admin assistant for a Card Management System. 
               You help bank employees manage customers and cards using the tools provided.
               Be professional, concise, and helpful.`
    });
    
    // Handle tool calls
    if (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find(block => block.type === 'tool_use');
      if (toolUse) {
        const toolResult = await this.executeToolCall(toolUse.name, toolUse.input);
        
        // Send tool result back to Claude for final response
        const finalResponse = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            ...conversationHistory,
            { role: 'user', content: message },
            { role: 'assistant', content: response.content },
            {
              role: 'user',
              content: [{
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify(toolResult)
              }]
            }
          ]
        });
        
        return {
          response: finalResponse.content[0].text,
          toolCalled: toolUse.name,
          toolParams: toolUse.input,
          toolResult: toolResult
        };
      }
    }
    
    return {
      response: response.content[0].text,
      toolCalled: null,
      toolParams: null,
      toolResult: null
    };
  }
  
  async executeToolCall(toolName: string, params: any) {
    switch (toolName) {
      case 'get_all_customers':
        return await mcp.getAllCustomers();
      case 'get_customer_by_id':
        return await mcp.getCustomerById(params.customerId);
      case 'create_customer':
        return await mcp.createCustomer(params.name, params.email, params.phone);
      // ... handle all 10 tools
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
```

**Test LLM integration:**
```typescript
const llm = new LLMService();
const result = await llm.processMessage('Show me all customers', []);
console.log(result.response);
```

---

## 🌐 STEP 3: BACKEND API

### Create Chat API

**Create `src/routes/chat.routes.ts`:**

```typescript
import express from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = express.Router();
const chatController = new ChatController();

router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getHistory);
router.delete('/history/:sessionId', chatController.clearHistory);
router.get('/capabilities', chatController.getCapabilities);

export default router;
```

**Create `src/controllers/chat.controller.ts`:**

```typescript
import { Request, Response } from 'express';
import { LLMService } from '../services/llm.service';

const llm = new LLMService();
const sessions: Map<string, any[]> = new Map(); // In-memory for MVP

export class ChatController {
  
  async sendMessage(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;
      
      // Get conversation history
      const history = sessions.get(sessionId) || [];
      
      // Process with LLM
      const result = await llm.processMessage(message, history);
      
      // Update history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: result.response });
      sessions.set(sessionId, history);
      
      res.json({
        success: true,
        data: {
          sessionId,
          agentResponse: result.response,
          toolCalled: result.toolCalled,
          toolParams: result.toolParams,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async getHistory(req: Request, res: Response) {
    const { sessionId } = req.params;
    const history = sessions.get(sessionId) || [];
    res.json({ success: true, data: { sessionId, messages: history } });
  }
  
  async clearHistory(req: Request, res: Response) {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    res.json({ success: true, message: 'History cleared' });
  }
  
  async getCapabilities(req: Request, res: Response) {
    // Return list of tools and examples
    res.json({
      success: true,
      data: {
        tools: [/* tool definitions */],
        examples: [
          'Show me all customers',
          'Get customer CUST123456',
          'Create a card for customer CUST123456'
        ]
      }
    });
  }
}
```

**Create `src/app.ts`:**

```typescript
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Agent backend running on port ${PORT}`);
});
```

**Test backend:**
```bash
npm run dev
# Test with curl or Postman
```

---

## 🎨 STEP 4: FRONTEND CHAT INTERFACE

### Initialize Frontend

```bash
cd agent-frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Create Chat Components

**Create `src/components/ChatInterface.tsx`:**

```typescript
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(`sess_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initial greeting
    setMessages([{
      role: 'agent',
      content: "Hello! I'm your CMS admin assistant. I can help you manage customers and cards. What would you like to do?",
      timestamp: new Date().toISOString()
    }]);
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing
    setIsTyping(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        sessionId,
        message
      });
      
      // Add agent response
      const agentMessage: Message = {
        role: 'agent',
        content: response.data.data.agentResponse,
        timestamp: response.data.data.timestamp
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const clearConversation = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/chat/history/${sessionId}`);
      setMessages([{
        role: 'agent',
        content: "Conversation cleared. How can I help you?",
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CMS Admin Agent</h1>
        <button
          onClick={clearConversation}
          className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
        >
          Clear
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  );
}
```

**Create `src/components/MessageBubble.tsx`:**

```typescript
import React from 'react';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.role === 'agent';
  
  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-2xl px-4 py-2 rounded-lg ${
          isAgent
            ? 'bg-gray-200 text-gray-900'
            : 'bg-blue-600 text-white'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
```

**Create `src/components/ChatInput.tsx`:**

```typescript
import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
}
```

**Create `src/components/TypingIndicator.tsx`:**

```typescript
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 px-4 py-2 rounded-lg">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
```

**Update `src/App.tsx`:**

```typescript
import ChatInterface from './components/ChatInterface';

function App() {
  return <ChatInterface />;
}

export default App;
```

---

## 🧪 STEP 5: TESTING

### Test Checklist

**MCP Integration:**
- [ ] All 10 tools tested individually
- [ ] Error handling works
- [ ] Response formatting correct

**LLM Integration:**
- [ ] Claude/GPT responds to messages
- [ ] Tool calling works
- [ ] Natural language responses generated
- [ ] Context maintained

**Backend API:**
- [ ] POST /chat/message works
- [ ] GET /chat/history works
- [ ] DELETE /chat/history works
- [ ] Error handling works

**Frontend:**
- [ ] Messages display correctly
- [ ] Can send messages
- [ ] Typing indicator works
- [ ] Scroll to bottom works
- [ ] Clear conversation works

**End-to-End:**
- [ ] Full conversation flow works
- [ ] All demo scenarios work
- [ ] No console errors

---

## 🚀 STEP 6: DEPLOYMENT

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=your-api-key-here
MCP_BASE_URL=https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms
CORS_ORIGIN=https://your-frontend-url.com
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
```

### Deploy to EXISTING Infrastructure

**REMINDER: Do NOT create new Heroku apps!**

**Backend:**
```bash
cd agent-backend
# Add existing Heroku app as remote
heroku git:remote -a <existing-backend-app-name>
git push heroku feature/admin-agent:main
```

**Frontend:**
```bash
cd agent-frontend
npm run build
# Deploy to existing hosting (Netlify/Vercel/S3)
```

---

## ✅ ACCEPTANCE CRITERIA

**The Agent is complete when:**

### Functional Requirements
- [ ] Can connect to MCP server
- [ ] All 10 MCP tools work
- [ ] LLM responds naturally
- [ ] Can view all customers
- [ ] Can get specific customer
- [ ] Can create customer
- [ ] Can update customer
- [ ] Can delete customer (with confirmation)
- [ ] Can view all cards
- [ ] Can get specific card
- [ ] Can create card
- [ ] Can update card
- [ ] Can delete card (with confirmation)
- [ ] Context retention works
- [ ] Help command works

### Quality Requirements
- [ ] **NO console errors** in browser
- [ ] **NO errors** in backend logs
- [ ] LLM integration working
- [ ] MCP integration working
- [ ] All demo scenarios work end-to-end

### Deployment Requirements
- [ ] **Both frontend AND backend work together**
- [ ] Ready to deploy to EXISTING infrastructure
- [ ] Environment variables configured
- [ ] API keys secured

---

## 🎉 FINAL STEPS

**When everything works on `feature/admin-agent`:**

1. **Final Testing**
   - Test all MCP tools
   - Test all demo scenarios
   - Test error handling
   - No console errors

2. **Create Pull Request**
   - Review changes
   - Test once more

3. **Merge to Master**
   ```bash
   git checkout master
   git merge feature/admin-agent --no-ff
   git push origin master
   ```

4. **Deploy to Existing Infrastructure**

5. **You're Ready to Demo!** 🚀

---

## 📞 QUESTIONS?

**Remember:**
- Test MCP connection FIRST before anything else
- Test each MCP tool individually
- Integrate LLM only after MCP works
- Build UI only after backend works
- Test everything before deploying
- Deploy ONLY when complete

**The goal:** A working conversational agent that demonstrates MCP integration and AI-powered banking operations!

---

**Good luck with the build!** 🤖💪
