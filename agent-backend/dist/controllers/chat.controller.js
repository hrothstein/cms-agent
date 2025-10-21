"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const llm_service_1 = require("../services/llm.service");
const sessions = new Map();
const llmService = new llm_service_1.LLMService();
class ChatController {
    /**
     * POST /api/v1/chat/message
     * Send a message to the agent
     */
    async sendMessage(req, res) {
        try {
            const { sessionId, message } = req.body;
            if (!message || typeof message !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required and must be a string',
                });
            }
            if (!sessionId || typeof sessionId !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Session ID is required and must be a string',
                });
            }
            // Get or create session
            let session = sessions.get(sessionId);
            if (!session) {
                session = {
                    sessionId,
                    messages: [],
                    createdAt: new Date(),
                    lastActive: new Date(),
                };
                sessions.set(sessionId, session);
            }
            // Get conversation history
            const conversationHistory = session.messages;
            // Process message with LLM
            const result = await llmService.processMessage(message, conversationHistory);
            // Update session with new messages
            session.messages.push({
                role: 'user',
                content: message,
            });
            session.messages.push({
                role: 'assistant',
                content: result.response,
            });
            session.lastActive = new Date();
            // Return response
            res.json({
                success: true,
                data: {
                    sessionId,
                    agentResponse: result.response,
                    toolsUsed: result.toolsUsed,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
    /**
     * GET /api/v1/chat/history/:sessionId
     * Get conversation history for a session
     */
    async getHistory(req, res) {
        try {
            const { sessionId } = req.params;
            const session = sessions.get(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found',
                });
            }
            res.json({
                success: true,
                data: {
                    sessionId,
                    messages: session.messages,
                    createdAt: session.createdAt,
                    lastActive: session.lastActive,
                },
            });
        }
        catch (error) {
            console.error('Error in getHistory:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
    /**
     * DELETE /api/v1/chat/history/:sessionId
     * Clear conversation history
     */
    async clearHistory(req, res) {
        try {
            const { sessionId } = req.params;
            const session = sessions.get(sessionId);
            if (session) {
                session.messages = [];
                session.lastActive = new Date();
            }
            res.json({
                success: true,
                message: 'Conversation history cleared',
            });
        }
        catch (error) {
            console.error('Error in clearHistory:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
    /**
     * GET /api/v1/chat/capabilities
     * Get agent capabilities (tools and examples)
     */
    async getCapabilities(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    tools: [
                        {
                            name: 'get_all_customers',
                            description: 'Get all customers in system',
                            parameters: [],
                        },
                        {
                            name: 'get_customer_by_id',
                            description: 'Get specific customer details',
                            parameters: ['customerId'],
                        },
                        {
                            name: 'create_customer',
                            description: 'Create new customer',
                            parameters: ['name', 'email', 'phone'],
                        },
                        {
                            name: 'update_customer',
                            description: 'Update customer information',
                            parameters: ['customerId', 'name', 'email', 'phone'],
                        },
                        {
                            name: 'delete_customer',
                            description: 'Delete customer',
                            parameters: ['customerId'],
                        },
                        {
                            name: 'get_all_cards',
                            description: 'Get all cards in system',
                            parameters: [],
                        },
                        {
                            name: 'get_card_by_id',
                            description: 'Get specific card details',
                            parameters: ['cardId'],
                        },
                        {
                            name: 'create_card',
                            description: 'Create new card',
                            parameters: ['customerId', 'cardNumber', 'cardType', 'expiryDate'],
                        },
                        {
                            name: 'update_card',
                            description: 'Update card information',
                            parameters: ['cardId', 'cardNumber', 'cardType', 'expiryDate'],
                        },
                        {
                            name: 'delete_card',
                            description: 'Delete card',
                            parameters: ['cardId'],
                        },
                    ],
                    examples: [
                        'Show me all customers',
                        'Get customer CUST123456',
                        'Create a new customer named John Doe with email john@example.com and phone 555-1234',
                        'List all cards',
                        'Create a debit card for customer CUST123456',
                        'Update card CARD789 expiry to 12/2027',
                        'Delete card CARD789',
                    ],
                },
            });
        }
        catch (error) {
            console.error('Error in getCapabilities:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
}
exports.ChatController = ChatController;
