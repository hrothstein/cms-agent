"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPService = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
// Ensure URL ends with /
const baseUrl = process.env.MCP_BASE_URL || 'https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms';
const MCP_SERVER_URL = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
class MCPService {
    constructor() {
        this.connected = false;
        // Configure StreamableHTTP transport with proper headers
        const transportOptions = {
            requestInit: {
                headers: {
                    'Accept': 'application/json, text/event-stream',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.transport = new streamableHttp_js_1.StreamableHTTPClientTransport(new URL(MCP_SERVER_URL), transportOptions);
        this.client = new index_js_1.Client({
            name: 'cms-admin-agent',
            version: '1.0.0',
        }, {
            capabilities: {},
        });
    }
    async connect() {
        if (this.connected) {
            return;
        }
        try {
            await this.client.connect(this.transport);
            this.connected = true;
            console.log('✓ Connected to MCP server');
        }
        catch (error) {
            console.error('Failed to connect to MCP server:', error);
            throw new Error(`Failed to connect to MCP server: ${error}`);
        }
    }
    async disconnect() {
        if (this.connected) {
            await this.client.close();
            this.connected = false;
        }
    }
    async callTool(toolName, args = {}) {
        if (!this.connected) {
            await this.connect();
        }
        try {
            const result = await this.client.callTool({
                name: toolName,
                arguments: args,
            });
            // Extract the content from the MCP response
            if (result.content && Array.isArray(result.content) && result.content.length > 0) {
                const textContent = result.content.find((c) => c.type === 'text');
                if (textContent && textContent.text) {
                    try {
                        return JSON.parse(textContent.text);
                    }
                    catch {
                        return textContent.text;
                    }
                }
            }
            return result;
        }
        catch (error) {
            throw new Error(`MCP tool call failed for ${toolName}: ${error.message}`);
        }
    }
    // Customer Management Tools
    async getAllCustomers() {
        return this.callTool('get_all_customers');
    }
    async getCustomerById(customerId) {
        return this.callTool('get_customer_by_id', { customerId });
    }
    async createCustomer(name, email, phone) {
        return this.callTool('create_customer', { name, email, phone });
    }
    async updateCustomer(customerId, name, email, phone) {
        return this.callTool('update_customer', {
            customerId,
            name,
            email,
            phone,
        });
    }
    async deleteCustomer(customerId) {
        return this.callTool('delete_customer', { customerId });
    }
    // Card Management Tools
    async getAllCards() {
        return this.callTool('get_all_cards');
    }
    async getCardById(cardId) {
        return this.callTool('get_card_by_id', { cardId });
    }
    async createCard(customerId, cardNumber, cardType, expiryDate) {
        return this.callTool('create_card', {
            customerId,
            cardNumber,
            cardType,
            expiryDate,
        });
    }
    async updateCard(cardId, cardNumber, cardType, expiryDate) {
        return this.callTool('update_card', {
            cardId,
            cardNumber,
            cardType,
            expiryDate,
        });
    }
    async deleteCard(cardId) {
        return this.callTool('delete_card', { cardId });
    }
    // List available tools (for debugging)
    async listTools() {
        if (!this.connected) {
            await this.connect();
        }
        return this.client.listTools();
    }
}
exports.MCPService = MCPService;
