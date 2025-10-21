# CMS Admin Agent - Frontend

React + TypeScript chat interface for the CMS Admin Agent.

## Features

- 💬 Real-time chat interface
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Fast and lightweight (Vite)
- 🔄 Session-based conversation history
- 📱 Mobile-friendly design
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Prerequisites

- Node.js 20 LTS or higher
- npm or yarn
- Backend API running on `http://localhost:3001`

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── MessageBubble.tsx     # Individual message display
│   ├── ChatInput.tsx         # Message input field
│   └── TypingIndicator.tsx   # Loading animation
├── services/
│   └── api.ts                # Backend API client
├── App.tsx                   # Root component
└── index.css                 # Global styles
```

## Usage

The chat interface connects to the backend API at `http://localhost:3001/api/v1` by default.

### Example Queries

- "Show me all customers"
- "List all cards"
- "Get customer CUST123456"
- "Create a new customer named John Doe with email john@example.com and phone 555-1234"
- "help"

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

## License

ISC
