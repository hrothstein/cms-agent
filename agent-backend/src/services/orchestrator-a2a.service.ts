/**
 * Orchestrator A2A Service
 * Exposes orchestrator capabilities via A2A Protocol
 */

import { A2AServer, SkillHandler } from '@cms/a2a-sdk';
import { orchestratorAgentCard } from '../config/agent-card';
import { MCPService } from './mcp.service';
import { LLMService } from './llm.service';

const mcp = new MCPService();
const llm = new LLMService();

/**
 * Create skill handlers for orchestrator capabilities
 */
function createSkillHandlers(): Map<string, SkillHandler> {
  const handlers = new Map<string, SkillHandler>();

  // Skill: manage_customer
  handlers.set('manage_customer', async (params) => {
    const { operation, customerId, name, email, phone } = params;

    try {
      switch (operation) {
        case 'get_all':
          const customers = await mcp.getAllCustomers();
          return { success: true, data: customers, message: 'Customers retrieved' };

        case 'get_by_id':
          if (!customerId) throw new Error('customerId required');
          const customer = await mcp.getCustomerById(customerId);
          return { success: true, data: customer, message: 'Customer retrieved' };

        case 'create':
          if (!name || !email || !phone) throw new Error('name, email, phone required');
          const newCustomer = await mcp.createCustomer(name, email, phone);
          return { success: true, data: newCustomer, message: 'Customer created' };

        case 'update':
          if (!customerId || !name || !email || !phone) {
            throw new Error('customerId, name, email, phone required');
          }
          const updatedCustomer = await mcp.updateCustomer(customerId, name, email, phone);
          return { success: true, data: updatedCustomer, message: 'Customer updated' };

        case 'delete':
          if (!customerId) throw new Error('customerId required');
          await mcp.deleteCustomer(customerId);
          return { success: true, data: null, message: 'Customer deleted' };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Operation failed'
      };
    }
  });

  // Skill: manage_card
  handlers.set('manage_card', async (params) => {
    const { operation, cardId, customerId, cardNumber, cardType, expiryDate } = params;

    try {
      switch (operation) {
        case 'get_all':
          const cards = await mcp.getAllCards();
          return { success: true, data: cards, message: 'Cards retrieved' };

        case 'get_by_id':
          if (!cardId) throw new Error('cardId required');
          const card = await mcp.getCardById(cardId);
          return { success: true, data: card, message: 'Card retrieved' };

        case 'create':
          if (!customerId || !cardNumber || !cardType || !expiryDate) {
            throw new Error('customerId, cardNumber, cardType, expiryDate required');
          }
          const newCard = await mcp.createCard(customerId, cardNumber, cardType, expiryDate);
          return { success: true, data: newCard, message: 'Card created' };

        case 'update':
          if (!cardId || !cardNumber || !cardType || !expiryDate) {
            throw new Error('cardId, cardNumber, cardType, expiryDate required');
          }
          const updatedCard = await mcp.updateCard(cardId, cardNumber, cardType, expiryDate);
          return { success: true, data: updatedCard, message: 'Card updated' };

        case 'delete':
          if (!cardId) throw new Error('cardId required');
          await mcp.deleteCard(cardId);
          return { success: true, data: null, message: 'Card deleted' };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Operation failed'
      };
    }
  });

  // Skill: coordinate_agents
  handlers.set('coordinate_agents', async (params) => {
    const { workflow, parameters } = params;

    // Placeholder for multi-agent coordination
    // Will be implemented when specialist agents are built
    return {
      success: true,
      results: [],
      summary: `Workflow '${workflow}' coordination pending specialist agent implementation`
    };
  });

  // Skill: process_natural_language
  handlers.set('process_natural_language', async (params) => {
    const { message, sessionId } = params;

    try {
      const conversationHistory: any[] = []; // Would retrieve from session storage
      const result = await llm.processMessage(message, conversationHistory);

      return {
        success: true,
        response: result.response,
        toolsUsed: result.toolsUsed
      };
    } catch (error: any) {
      return {
        success: false,
        response: `Error processing message: ${error.message}`,
        toolsUsed: []
      };
    }
  });

  return handlers;
}

/**
 * Create and configure the A2A server for orchestrator
 */
export function createOrchestratorA2AServer(): A2AServer {
  const skillHandlers = createSkillHandlers();
  
  const server = new A2AServer(
    orchestratorAgentCard,
    skillHandlers,
    {
      port: parseInt(process.env.A2A_PORT || '3010'),
      cors: true,
      logRequests: true
    }
  );

  return server;
}

