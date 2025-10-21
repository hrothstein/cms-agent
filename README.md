# CMS Admin Agent 🤖

A conversational AI agent that provides bank employees with a natural language interface to manage customers and cards in the Card Management System (CMS).

## 🎯 Overview

This project demonstrates the power of conversational AI for banking operations using:
- **Azure OpenAI (GPT-4)** for natural language understanding
- **MCP (Model Context Protocol)** for standardized tool integration
- **React + TypeScript** for a modern chat interface
- **Node.js + Express** for the backend API

## 🏗️ Architecture

```
┌─────────────────────────┐
│  Bank Employee          │  ← Admin User
│  (CSR, Operations)      │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Agent Frontend UI      │  ← React Chat Interface
│  (Port 5173)            │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  Agent Backend          │  ← Node.js + Azure OpenAI
│  (Port 3001)            │
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│  MCP Server             │  ← Protocol Layer
│  hbr-flextest...        │
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

## ✨ Features

### Customer Management
- 📋 View all customers
- 🔍 Get specific customer details
- ➕ Create new customers
- ✏️ Update customer information
- 🗑️ Delete customers (with confirmation)

### Card Management
- 📋 View all cards
- 🔍 Get specific card details
- ➕ Create new cards
- ✏️ Update card information
- 🗑️ Delete cards (with confirmation)

### Conversational Features
- 💬 Natural language interface
- 🧠 Context retention across conversation
- 🎯 Smart intent recognition
- ❓ Built-in help system
- ⚠️ Confirmation prompts for destructive actions
- 📊 Formatted data display

## 🚀 Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- npm or yarn
- Azure OpenAI API key and endpoint
- Access to MCP server

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CMS-Agent
git checkout feature/admin-agent
```

2. **Setup Backend**
```bash
cd agent-backend
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=3001
MCP_BASE_URL=https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-08-01-preview

CORS_ORIGIN=http://localhost:5173
EOF
```

3. **Setup Frontend**
```bash
cd ../agent-frontend
npm install

# .env is already created with correct values
```

### Running the Agent

**Terminal 1 - Backend:**
```bash
cd agent-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd agent-frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

### Testing MCP Connection

```bash
cd agent-backend
npm run test-mcp      # Test all 10 MCP tools
npm run list-tools    # List available tools
```

## 💬 Example Conversations

### View Customers
```
User: "Show me all customers"
Agent: "I found 0 customers in the system currently."
```

### Create a Customer
```
User: "Create a new customer named John Doe with email john@example.com and phone 555-1234"
Agent: "I'll create a new customer for you... [creates customer]"
```

### View Cards
```
User: "List all cards"
Agent: "Here are all the cards in the system..."
```

### Get Help
```
User: "help"
Agent: "I can help you manage customers and cards. Here's what I can do:..."
```

### Context Retention
```
User: "Get customer CUST123456"
Agent: "Here are the details for John Doe..."

User: "What cards do they have?"
Agent: [remembers CUST123456] "John Doe has 2 cards..."
```

## 🔧 Technology Stack

### Backend
- Node.js 20 LTS
- Express.js
- TypeScript
- Azure OpenAI (GPT-4 or GPT-4-turbo)
- @modelcontextprotocol/sdk
- Axios for HTTP

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Integration
- MCP (Model Context Protocol)
- StreamableHTTP transport
- JSON-RPC messaging

## 📁 Project Structure

```
CMS-Agent/
├── agent-backend/          # Node.js backend with LLM
│   ├── src/
│   │   ├── services/       # MCP & LLM services
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   └── app.ts          # Express app
│   ├── dist/               # Compiled JavaScript
│   └── package.json
│
├── agent-frontend/         # React chat interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── App.tsx         # Root component
│   └── package.json
│
├── CMS_Admin_Agent_PRD.md  # Product requirements
└── README.md               # This file
```

## 🔌 Available MCP Tools

1. **get_all_customers** - Retrieve all customers
2. **get_customer_by_id** - Get specific customer by ID
3. **create_customer** - Create new customer
4. **update_customer** - Update customer information
5. **delete_customer** - Delete a customer
6. **get_all_cards** - Retrieve all cards
7. **get_card_by_id** - Get specific card by ID
8. **create_card** - Create new card for customer
9. **update_card** - Update card information
10. **delete_card** - Delete a card

## 🧪 Testing

### MCP Connection
```bash
cd agent-backend
npm run test-mcp
```

### Backend API
```bash
# Start backend
cd agent-backend
npm run dev

# Test endpoint
curl -X POST http://localhost:3001/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"Show me all customers"}'
```

### Frontend
```bash
cd agent-frontend
npm run build     # Build for production
npm run preview   # Preview production build
```

## 📊 Demo Scenarios

### Scenario 1: View All Customers
1. User: "Show me all customers"
2. Agent calls `get_all_customers` via MCP
3. Agent displays formatted list

### Scenario 2: Create New Card
1. User: "Create a debit card for customer CUST123"
2. Agent asks for missing details (card number, expiry)
3. User provides information
4. Agent calls `create_card` via MCP
5. Agent confirms creation

### Scenario 3: Safe Delete
1. User: "Delete card CARD789"
2. Agent shows confirmation prompt with card details
3. User confirms: "confirm"
4. Agent calls `delete_card` via MCP
5. Agent confirms deletion

## 🔒 Security

- Session-based conversation tracking
- Confirmation required for destructive operations
- Input validation on all API endpoints
- CORS configured for frontend origin
- Environment variables for sensitive data
- No storage of sensitive customer/card data in agent

## 📝 API Documentation

### Backend API

**Base URL:** `http://localhost:3001/api/v1`

#### Endpoints

- `POST /chat/message` - Send message to agent
- `GET /chat/history/:sessionId` - Get conversation history
- `DELETE /chat/history/:sessionId` - Clear conversation
- `GET /chat/capabilities` - Get agent capabilities
- `GET /health` - Health check

See [agent-backend/README.md](agent-backend/README.md) for detailed API docs.

## 🚢 Deployment

This is a demo/MVP application. For production deployment:

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Add authentication/authorization
4. Implement proper session storage (Redis/DB)
5. Add rate limiting
6. Configure monitoring and logging
7. Use HTTPS for all connections

## 📖 Documentation

- [Backend README](agent-backend/README.md)
- [Frontend README](agent-frontend/README.md)
- [Product Requirements](CMS_Admin_Agent_PRD.md)
- [Quick Start Guide](CURSOR_PROMPTS_QUICKSTART.md)

## 🤝 Contributing

This is a demo project for showcasing MCP integration with conversational AI.

## 📄 License

ISC

## 🙋‍♂️ Support

For questions about the CMS Admin Agent, refer to the PRD document or contact the development team.

---

**Built with ❤️ using Azure OpenAI, MCP, and React**

