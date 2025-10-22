/**
 * Orchestrator Agent Card
 * Published at /.well-known/agent.json for A2A discovery
 */

import { AgentCard } from '@cms/a2a-sdk';

const ORCHESTRATOR_ENDPOINT = process.env.ORCHESTRATOR_ENDPOINT || 'http://localhost:3000';

export const orchestratorAgentCard: AgentCard = {
  id: 'cms-agent',
  name: 'CMS Agent',
  description: 'Card Management System agent for managing customers and cards. Provides natural language interface and A2A protocol support.',
  version: '2.0.0',
  capabilities: [
    'customer_management',
    'card_management',
    'natural_language_processing',
    'a2a_protocol'
  ],
  skills: [
    {
      name: 'manage_customer',
      description: 'Comprehensive customer management including create, read, update, delete operations',
      parameters: {
        operation: {
          type: 'string',
          required: true,
          description: 'Operation to perform: get_all, get_by_id, create, update, delete'
        },
        customerId: {
          type: 'string',
          required: false,
          description: 'Customer ID (required for get_by_id, update, delete)'
        },
        name: {
          type: 'string',
          required: false,
          description: 'Customer name (for create/update)'
        },
        email: {
          type: 'string',
          required: false,
          description: 'Customer email (for create/update)'
        },
        phone: {
          type: 'string',
          required: false,
          description: 'Customer phone (for create/update)'
        }
      },
      returns: {
        success: { type: 'boolean' },
        data: { type: 'object', description: 'Customer data or array of customers' },
        message: { type: 'string' }
      }
    },
    {
      name: 'manage_card',
      description: 'Comprehensive card management including create, read, update, delete operations',
      parameters: {
        operation: {
          type: 'string',
          required: true,
          description: 'Operation to perform: get_all, get_by_id, create, update, delete'
        },
        cardId: {
          type: 'string',
          required: false,
          description: 'Card ID (required for get_by_id, update, delete)'
        },
        customerId: {
          type: 'string',
          required: false,
          description: 'Customer ID (for create)'
        },
        cardNumber: {
          type: 'string',
          required: false,
          description: 'Card number (for create/update)'
        },
        cardType: {
          type: 'string',
          required: false,
          description: 'Card type (for create/update)'
        },
        expiryDate: {
          type: 'string',
          required: false,
          description: 'Expiry date (for create/update)'
        }
      },
      returns: {
        success: { type: 'boolean' },
        data: { type: 'object', description: 'Card data or array of cards' },
        message: { type: 'string' }
      }
    },
    {
      name: 'coordinate_agents',
      description: 'Coordinate multiple specialist agents to solve complex workflows',
      parameters: {
        workflow: {
          type: 'string',
          required: true,
          description: 'Workflow type: fraud_investigation, compliance_check, customer_analysis'
        },
        parameters: {
          type: 'object',
          required: true,
          description: 'Workflow-specific parameters'
        }
      },
      returns: {
        success: { type: 'boolean' },
        results: { type: 'array', description: 'Results from coordinated agents' },
        summary: { type: 'string' }
      }
    },
    {
      name: 'process_natural_language',
      description: 'Process natural language queries and execute appropriate CMS operations',
      parameters: {
        message: {
          type: 'string',
          required: true,
          description: 'Natural language query from user'
        },
        sessionId: {
          type: 'string',
          required: false,
          description: 'Session ID for conversation context'
        }
      },
      returns: {
        success: { type: 'boolean' },
        response: { type: 'string', description: 'Natural language response' },
        toolsUsed: { type: 'array', description: 'Tools/agents used to fulfill request' }
      }
    }
  ],
  endpoints: {
    task_submit: `${ORCHESTRATOR_ENDPOINT}/a2a/task/submit`,
    task_status: `${ORCHESTRATOR_ENDPOINT}/a2a/task/{task_id}/status`,
    task_stream: `${ORCHESTRATOR_ENDPOINT}/a2a/task/{task_id}/stream`
  },
  supported_protocols: ['JSON-RPC 2.0'],
  authentication: {
    type: 'Bearer',
    required: false // Set to true in production
  },
  metadata: {
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    mcpEnabled: true,
    a2aEnabled: true
  }
};

