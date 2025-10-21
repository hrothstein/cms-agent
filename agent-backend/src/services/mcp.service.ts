import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// Ensure URL ends with /
const baseUrl = process.env.MCP_BASE_URL || 'https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms';
const MCP_SERVER_URL = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
}

export interface Card {
  cardId: string;
  customerId: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
}

export class MCPService {
  private client: Client;
  private transport: StreamableHTTPClientTransport;
  private connected: boolean = false;

  constructor() {
    // Configure StreamableHTTP transport with proper headers
    const transportOptions = {
      requestInit: {
        headers: {
          'Accept': 'application/json, text/event-stream',
          'Content-Type': 'application/json',
        },
      },
    };
    
    this.transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL), transportOptions);
    this.client = new Client(
      {
        name: 'cms-admin-agent',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      await this.client.connect(this.transport);
      this.connected = true;
      console.log('✓ Connected to MCP server');
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw new Error(`Failed to connect to MCP server: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }

  private async callTool(toolName: string, args: any = {}): Promise<any> {
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
        const textContent = result.content.find((c: any) => c.type === 'text');
        if (textContent && textContent.text) {
          try {
            return JSON.parse(textContent.text);
          } catch {
            return textContent.text;
          }
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`MCP tool call failed for ${toolName}: ${error.message}`);
    }
  }

  // Customer Management Tools

  async getAllCustomers(): Promise<Customer[]> {
    return this.callTool('get_all_customers');
  }

  async getCustomerById(customerId: string): Promise<Customer> {
    return this.callTool('get_customer_by_id', { customerId });
  }

  async createCustomer(name: string, email: string, phone: string): Promise<Customer> {
    return this.callTool('create_customer', { name, email, phone });
  }

  async updateCustomer(
    customerId: string,
    name: string,
    email: string,
    phone: string
  ): Promise<Customer> {
    return this.callTool('update_customer', {
      customerId,
      name,
      email,
      phone,
    });
  }

  async deleteCustomer(customerId: string): Promise<{ message: string }> {
    return this.callTool('delete_customer', { customerId });
  }

  // Card Management Tools

  async getAllCards(): Promise<Card[]> {
    return this.callTool('get_all_cards');
  }

  async getCardById(cardId: string): Promise<Card> {
    return this.callTool('get_card_by_id', { cardId });
  }

  async createCard(
    customerId: string,
    cardNumber: string,
    cardType: string,
    expiryDate: string
  ): Promise<Card> {
    return this.callTool('create_card', {
      customerId,
      cardNumber,
      cardType,
      expiryDate,
    });
  }

  async updateCard(
    cardId: string,
    cardNumber: string,
    cardType: string,
    expiryDate: string
  ): Promise<Card> {
    return this.callTool('update_card', {
      cardId,
      cardNumber,
      cardType,
      expiryDate,
    });
  }

  async deleteCard(cardId: string): Promise<{ message: string }> {
    return this.callTool('delete_card', { cardId });
  }

  // List available tools (for debugging)
  async listTools(): Promise<any> {
    if (!this.connected) {
      await this.connect();
    }
    return this.client.listTools();
  }
}
