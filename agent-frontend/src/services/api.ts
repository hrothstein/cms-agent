import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cms-agent-backend-c2e41095b884.herokuapp.com/api/v1';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    sessionId: string;
    agentResponse: string;
    toolsUsed: Array<{
      toolName: string;
      toolInput: any;
      toolResult: any;
      success: boolean;
      error?: string;
    }>;
    timestamp: string;
  };
}

export interface Capabilities {
  success: boolean;
  data: {
    tools: Array<{
      name: string;
      description: string;
      parameters: string[];
    }>;
    examples: string[];
  };
}

export const api = {
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, {
      sessionId,
      message,
    });
    return response.data;
  },

  async getHistory(sessionId: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/chat/history/${sessionId}`);
    return response.data;
  },

  async clearHistory(sessionId: string): Promise<any> {
    const response = await axios.delete(`${API_BASE_URL}/chat/history/${sessionId}`);
    return response.data;
  },

  async getCapabilities(): Promise<Capabilities> {
    const response = await axios.get(`${API_BASE_URL}/chat/capabilities`);
    return response.data;
  },
};

