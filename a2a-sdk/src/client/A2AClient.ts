/**
 * A2A Client SDK
 * Used by orchestrator to communicate with remote agents
 */

import axios, { AxiosInstance } from 'axios';
import { AgentCard } from '../types/AgentCard';
import { Task, TaskSubmission, TaskStatusResponse, TaskUpdate } from '../types/Task';
import { Message, MessageSendRequest, MessageSendResponse } from '../types/Message';
import { createRequest, validateResponse, JSONRPC_ERROR_CODES } from '../utils/jsonrpc';

export interface A2AClientOptions {
  authToken?: string;
  timeout?: number;
  retries?: number;
}

export class A2AClient {
  private baseUrl: string;
  private authToken?: string;
  private axios: AxiosInstance;
  private agentCard?: AgentCard;

  constructor(baseUrl: string, options?: A2AClientOptions) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.authToken = options?.authToken;

    this.axios = axios.create({
      timeout: options?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
    });
  }

  /**
   * Discover agent capabilities by fetching its Agent Card
   */
  async discoverAgent(): Promise<AgentCard> {
    try {
      const response = await this.axios.get<AgentCard>(`${this.baseUrl}/.well-known/agent.json`);
      this.agentCard = response.data;
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to discover agent: ${error.message}`);
    }
  }

  /**
   * Get the cached agent card
   */
  getAgentCard(): AgentCard | undefined {
    return this.agentCard;
  }

  /**
   * Submit a task to the remote agent
   */
  async submitTask(
    skill: string,
    parameters: Record<string, any>,
    clientAgentId: string
  ): Promise<Task> {
    const submission: TaskSubmission = {
      skill,
      parameters,
      clientAgentId,
    };

    const result = await this.jsonRpcRequest('task/submit', submission);
    return result as Task;
  }

  /**
   * Get the status of a task
   */
  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const result = await this.jsonRpcRequest('task/status', { taskId });
    return result as TaskStatusResponse;
  }

  /**
   * Stream task progress using Server-Sent Events (SSE)
   */
  async *streamTask(taskId: string): AsyncGenerator<TaskUpdate> {
    const streamUrl = `${this.baseUrl}/a2a/task/${taskId}/stream`;

    const response = await fetch(streamUrl, {
      headers: {
        Accept: 'text/event-stream',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to stream task: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data) {
              try {
                const update: TaskUpdate = JSON.parse(data);
                yield update;
              } catch (e) {
                console.error('Failed to parse SSE data:', e);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Send a message within a task context
   */
  async sendMessage(
    taskId: string,
    to: string,
    parts: Message['parts']
  ): Promise<MessageSendResponse> {
    const request: MessageSendRequest = {
      taskId,
      to,
      parts,
    };

    const result = await this.jsonRpcRequest('message/send', request);
    return result as MessageSendResponse;
  }

  /**
   * Cancel a task
   */
  async cancelTask(taskId: string): Promise<void> {
    await this.jsonRpcRequest('task/cancel', { taskId });
  }

  /**
   * Make a JSON-RPC 2.0 request
   */
  private async jsonRpcRequest(method: string, params: any): Promise<any> {
    const request = createRequest(method, params);

    try {
      const response = await this.axios.post(`${this.baseUrl}/a2a/jsonrpc`, request);

      // Validate response
      const validation = validateResponse(response.data);
      if (!validation.valid) {
        throw new Error(`Invalid JSON-RPC response: ${validation.error}`);
      }

      // Check for error
      if (response.data.error) {
        throw new Error(
          `JSON-RPC error [${response.data.error.code}]: ${response.data.error.message}`
        );
      }

      return response.data.result;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`HTTP error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Health check for the remote agent
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.jsonRpcRequest('agent/health', {});
      return result.healthy === true;
    } catch (error) {
      return false;
    }
  }
}

