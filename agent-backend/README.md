# CMS Admin Agent - Backend

Backend API server for the CMS Admin Agent, providing conversational AI capabilities for managing customers and cards through natural language.

## Features

- 🤖 Azure OpenAI (GPT-4) integration for natural language understanding
- 🔌 MCP (Model Context Protocol) client for CMS operations
- 💬 Conversational interface with context retention
- 🛠️ 10 MCP tools for customer and card management
- 📝 Session-based conversation history

## Prerequisites

- Node.js 20 LTS or higher
- npm or yarn
- Azure OpenAI API key and endpoint
- Access to MCP server

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
NODE_ENV=development
PORT=3001
MCP_BASE_URL=https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms/

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-08-01-preview

CORS_ORIGIN=http://localhost:5173
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Test MCP connection
npm run test-mcp

# List available MCP tools
npm run list-tools
```

## API Endpoints

### Chat Operations

- **POST** `/api/v1/chat/message` - Send a message to the agent
- **GET** `/api/v1/chat/history/:sessionId` - Get conversation history
- **DELETE** `/api/v1/chat/history/:sessionId` - Clear conversation history
- **GET** `/api/v1/chat/capabilities` - Get agent capabilities

### Health Check

- **GET** `/health` - Server health status

## Architecture

```
┌─────────────────┐
│  Express API    │
├─────────────────┤
│  Chat Routes    │
├─────────────────┤
│  LLM Service    │  ← Azure OpenAI (GPT-4)
├─────────────────┤
│  MCP Service    │  ← Protocol Client
├─────────────────┤
│  MCP Server     │  ← CMS Backend
└─────────────────┘
```

## Tools Available

### Customer Management
1. `get_all_customers` - Retrieve all customers
2. `get_customer_by_id` - Get specific customer
3. `create_customer` - Create new customer
4. `update_customer` - Update customer info
5. `delete_customer` - Delete customer

### Card Management
6. `get_all_cards` - Retrieve all cards
7. `get_card_by_id` - Get specific card
8. `create_card` - Create new card
9. `update_card` - Update card info
10. `delete_card` - Delete card

## Example Usage

```bash
# Send a message
curl -X POST http://localhost:3001/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session", "message": "Show me all customers"}'

# Get capabilities
curl http://localhost:3001/api/v1/chat/capabilities
```

## License

ISC

