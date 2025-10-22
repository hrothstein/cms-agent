"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const openai_1 = __importDefault(require("openai"));
const mcp_service_1 = require("./mcp.service");
// Validate Azure OpenAI configuration
if (!process.env.AZURE_OPENAI_API_KEY) {
    throw new Error('AZURE_OPENAI_API_KEY is required');
}
if (!process.env.AZURE_OPENAI_ENDPOINT) {
    throw new Error('AZURE_OPENAI_ENDPOINT is required');
}
if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
    throw new Error('AZURE_OPENAI_DEPLOYMENT_NAME is required');
}
// Initialize Azure OpenAI client
const openai = new openai_1.default({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview' },
    defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});
const mcp = new mcp_service_1.MCPService();
// Define MCP tools for OpenAI function calling
const tools = [
    {
        type: 'function',
        function: {
            name: 'get_all_customers',
            description: 'Retrieves all customers from the CMS API. Use this when the user asks to see, list, or show all customers.',
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_customer_by_id',
            description: 'Retrieves a specific customer by their ID. Use this when the user asks about a specific customer or provides a customer ID.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'create_customer',
            description: 'Creates a new customer in the CMS. Use this when the user wants to add or create a new customer.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'update_customer',
            description: 'Updates an existing customer\'s information. Use this when the user wants to modify or change customer details.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'delete_customer',
            description: 'Deletes a customer from the CMS. Use this when the user wants to remove or delete a customer. Always confirm with the user before deleting.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'get_all_cards',
            description: 'Retrieves all cards from the CMS API. Use this when the user asks to see, list, or show all cards.',
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_card_by_id',
            description: 'Retrieves a specific card by its ID. Use this when the user asks about a specific card or provides a card ID.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'create_card',
            description: 'Creates a new card for a customer in the CMS. Use this when the user wants to add or create a new card.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'update_card',
            description: 'Updates an existing card\'s information. Use this when the user wants to modify or change card details.',
            parameters: {
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
    },
    {
        type: 'function',
        function: {
            name: 'delete_card',
            description: 'Deletes a card from the CMS. Use this when the user wants to remove or delete a card. Always confirm with the user before deleting.',
            parameters: {
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
        let messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT,
            },
            ...conversationHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];
        let continueLoop = true;
        let iterationCount = 0;
        const maxIterations = 5; // Prevent infinite loops
        while (continueLoop && iterationCount < maxIterations) {
            iterationCount++;
            try {
                const response = await openai.chat.completions.create({
                    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
                    messages: messages,
                    tools: tools,
                    tool_choice: 'auto',
                    max_completion_tokens: 2000,
                });
                const responseMessage = response.choices[0].message;
                messages.push(responseMessage);
                // Check if the model wants to call functions
                if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                    // Execute all tool calls
                    for (const toolCall of responseMessage.tool_calls) {
                        if (toolCall.type !== 'function')
                            continue;
                        const functionName = toolCall.function.name;
                        const functionArgs = JSON.parse(toolCall.function.arguments);
                        const toolResult = await this.executeToolCall(functionName, functionArgs);
                        toolsUsed.push({
                            toolName: functionName,
                            toolInput: functionArgs,
                            toolResult: toolResult.data,
                            success: toolResult.success,
                            error: toolResult.error,
                        });
                        // Add function response to messages
                        messages.push({
                            role: 'tool',
                            content: JSON.stringify(toolResult.data),
                            tool_call_id: toolCall.id,
                        });
                    }
                    // Continue loop to get final response
                }
                else {
                    // No more function calls, return the response
                    continueLoop = false;
                    return {
                        response: responseMessage.content || 'No response generated.',
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
        // If we hit max iterations
        return {
            response: 'I processed your request but encountered complexity limits. Please try breaking your request into smaller parts.',
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
