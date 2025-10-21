"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const mcp_service_1 = require("./mcp.service");
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});
const mcp = new mcp_service_1.MCPService();
// Define MCP tools for Claude function calling
const tools = [
    {
        name: 'get_all_customers',
        description: 'Retrieves all customers from the CMS API. Use this when the user asks to see, list, or show all customers.',
        input_schema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_customer_by_id',
        description: 'Retrieves a specific customer by their ID. Use this when the user asks about a specific customer or provides a customer ID.',
        input_schema: {
            type: 'object',
            properties: {
                customerId: {
                    type: 'string',
                    description: 'The unique identifier of the customer (e.g., CUST123456)',
                },
            },
            required: ['customerId'],
        },
    },
    {
        name: 'create_customer',
        description: 'Creates a new customer in the CMS. Use this when the user wants to add or create a new customer.',
        input_schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The full name of the customer',
                },
                email: {
                    type: 'string',
                    description: 'The email address of the customer',
                },
                phone: {
                    type: 'string',
                    description: 'The phone number of the customer',
                },
            },
            required: ['name', 'email', 'phone'],
        },
    },
    {
        name: 'update_customer',
        description: 'Updates an existing customer\'s information. Use this when the user wants to modify or change customer details.',
        input_schema: {
            type: 'object',
            properties: {
                customerId: {
                    type: 'string',
                    description: 'The unique identifier of the customer to update',
                },
                name: {
                    type: 'string',
                    description: 'The updated name of the customer',
                },
                email: {
                    type: 'string',
                    description: 'The updated email address',
                },
                phone: {
                    type: 'string',
                    description: 'The updated phone number',
                },
            },
            required: ['customerId', 'name', 'email', 'phone'],
        },
    },
    {
        name: 'delete_customer',
        description: 'Deletes a customer from the CMS. Use this when the user wants to remove or delete a customer. Always confirm with the user before deleting.',
        input_schema: {
            type: 'object',
            properties: {
                customerId: {
                    type: 'string',
                    description: 'The unique identifier of the customer to delete',
                },
            },
            required: ['customerId'],
        },
    },
    {
        name: 'get_all_cards',
        description: 'Retrieves all cards from the CMS API. Use this when the user asks to see, list, or show all cards.',
        input_schema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_card_by_id',
        description: 'Retrieves a specific card by its ID. Use this when the user asks about a specific card or provides a card ID.',
        input_schema: {
            type: 'object',
            properties: {
                cardId: {
                    type: 'string',
                    description: 'The unique identifier of the card',
                },
            },
            required: ['cardId'],
        },
    },
    {
        name: 'create_card',
        description: 'Creates a new card for a customer in the CMS. Use this when the user wants to add or create a new card.',
        input_schema: {
            type: 'object',
            properties: {
                customerId: {
                    type: 'string',
                    description: 'The ID of the customer who will own this card',
                },
                cardNumber: {
                    type: 'string',
                    description: 'The card number (16 digits)',
                },
                cardType: {
                    type: 'string',
                    description: 'The type of card (e.g., debit, credit)',
                },
                expiryDate: {
                    type: 'string',
                    description: 'The expiry date of the card (format: MM/YYYY)',
                },
            },
            required: ['customerId', 'cardNumber', 'cardType', 'expiryDate'],
        },
    },
    {
        name: 'update_card',
        description: 'Updates an existing card\'s information. Use this when the user wants to modify or change card details.',
        input_schema: {
            type: 'object',
            properties: {
                cardId: {
                    type: 'string',
                    description: 'The unique identifier of the card to update',
                },
                cardNumber: {
                    type: 'string',
                    description: 'The updated card number',
                },
                cardType: {
                    type: 'string',
                    description: 'The updated card type',
                },
                expiryDate: {
                    type: 'string',
                    description: 'The updated expiry date',
                },
            },
            required: ['cardId', 'cardNumber', 'cardType', 'expiryDate'],
        },
    },
    {
        name: 'delete_card',
        description: 'Deletes a card from the CMS. Use this when the user wants to remove or delete a card. Always confirm with the user before deleting.',
        input_schema: {
            type: 'object',
            properties: {
                cardId: {
                    type: 'string',
                    description: 'The unique identifier of the card to delete',
                },
            },
            required: ['cardId'],
        },
    },
];
const SYSTEM_PROMPT = `You are a helpful admin assistant for a Card Management System (CMS). You help bank employees manage customers and cards through natural language conversation.

Your role:
- Help bank employees perform administrative tasks efficiently
- Be professional, concise, and accurate
- Format data in a clear, readable way
- Ask for clarification when needed
- Maintain conversation context to provide seamless support

Available Operations:
1. Customer Management: View, create, update, and delete customers
2. Card Management: View, create, update, and delete cards

Guidelines:
- For delete operations, always ask for confirmation first
- Format lists and data clearly
- If a customer/card ID is needed but not provided, ask for it
- Keep responses concise but complete
- If an operation fails, explain why and suggest next steps
- Remember context from previous messages in the conversation

When displaying customers or cards:
- Show key information in a structured format
- For lists, show the most important details
- Use clear labels and formatting`;
class LLMService {
    constructor() {
        this.mcpInitialized = false;
    }
    async initialize() {
        if (!this.mcpInitialized) {
            await mcp.connect();
            this.mcpInitialized = true;
        }
    }
    async processMessage(userMessage, conversationHistory = []) {
        await this.initialize();
        const toolsUsed = [];
        let continueLoop = true;
        let currentMessages = [
            ...conversationHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];
        while (continueLoop) {
            try {
                const response = await anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 4096,
                    system: SYSTEM_PROMPT,
                    tools: tools,
                    messages: currentMessages,
                });
                // Check if Claude wants to use tools
                const toolUseBlock = response.content.find((block) => block.type === 'tool_use');
                if (toolUseBlock) {
                    // Execute the tool
                    const toolResult = await this.executeToolCall(toolUseBlock.name, toolUseBlock.input);
                    toolsUsed.push({
                        toolName: toolUseBlock.name,
                        toolInput: toolUseBlock.input,
                        toolResult: toolResult.data,
                        success: toolResult.success,
                        error: toolResult.error,
                    });
                    // Add assistant's response and tool result to conversation
                    currentMessages.push({
                        role: 'assistant',
                        content: response.content,
                    });
                    currentMessages.push({
                        role: 'user',
                        content: [
                            {
                                type: 'tool_result',
                                tool_use_id: toolUseBlock.id,
                                content: JSON.stringify(toolResult.data),
                            },
                        ],
                    });
                    // Continue loop to get final response
                }
                else {
                    // No more tools to use, extract final text response
                    const textBlock = response.content.find((block) => block.type === 'text');
                    return {
                        response: textBlock?.text || 'No response generated.',
                        toolsUsed,
                    };
                }
            }
            catch (error) {
                console.error('LLM Error:', error);
                return {
                    response: `I encountered an error: ${error.message}. Please try again.`,
                    toolsUsed,
                };
            }
        }
        return {
            response: 'An unexpected error occurred.',
            toolsUsed,
        };
    }
    async executeToolCall(toolName, params) {
        try {
            let result;
            switch (toolName) {
                case 'get_all_customers':
                    result = await mcp.getAllCustomers();
                    break;
                case 'get_customer_by_id':
                    result = await mcp.getCustomerById(params.customerId);
                    break;
                case 'create_customer':
                    result = await mcp.createCustomer(params.name, params.email, params.phone);
                    break;
                case 'update_customer':
                    result = await mcp.updateCustomer(params.customerId, params.name, params.email, params.phone);
                    break;
                case 'delete_customer':
                    result = await mcp.deleteCustomer(params.customerId);
                    break;
                case 'get_all_cards':
                    result = await mcp.getAllCards();
                    break;
                case 'get_card_by_id':
                    result = await mcp.getCardById(params.cardId);
                    break;
                case 'create_card':
                    result = await mcp.createCard(params.customerId, params.cardNumber, params.cardType, params.expiryDate);
                    break;
                case 'update_card':
                    result = await mcp.updateCard(params.cardId, params.cardNumber, params.cardType, params.expiryDate);
                    break;
                case 'delete_card':
                    result = await mcp.deleteCard(params.cardId);
                    break;
                default:
                    throw new Error(`Unknown tool: ${toolName}`);
            }
            return { success: true, data: result };
        }
        catch (error) {
            console.error(`Tool execution error for ${toolName}:`, error);
            return {
                success: false,
                data: null,
                error: error.message || 'Tool execution failed',
            };
        }
    }
    async disconnect() {
        if (this.mcpInitialized) {
            await mcp.disconnect();
            this.mcpInitialized = false;
        }
    }
}
exports.LLMService = LLMService;
