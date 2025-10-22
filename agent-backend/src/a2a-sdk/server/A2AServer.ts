/**
 * A2A Server SDK
 * Used by specialist agents to expose capabilities via A2A Protocol
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { AgentCard } from '../types/AgentCard';
import { Task, TaskUpdate } from '../types/Task';
import { MessageSendRequest } from '../types/Message';
import {
  JSONRPCRequest,
  createSuccessResponse,
  createErrorResponse,
  validateRequest,
  JSONRPC_ERROR_CODES,
} from '../utils/jsonrpc';
import { TaskManager } from './TaskManager';
import { generateMessageId } from '../utils/id-generator';

export type SkillHandler = (parameters: any, task: Task) => Promise<any>;

export interface A2AServerOptions {
  port?: number;
  cors?: boolean;
  authToken?: string;
  logRequests?: boolean;
}

export class A2AServer {
  private agentCard: AgentCard;
  private skillHandlers: Map<string, SkillHandler>;
  private taskManager: TaskManager;
  private app: Express;
  private server?: Server;
  private options: A2AServerOptions;
  private sseClients: Map<string, Response[]>; // taskId -> SSE response objects

  constructor(agentCard: AgentCard, skillHandlers: Map<string, SkillHandler>, options?: A2AServerOptions) {
    this.agentCard = agentCard;
    this.skillHandlers = skillHandlers;
    this.options = options || {};
    this.taskManager = new TaskManager();
    this.app = express();
    this.sseClients = new Map();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupTaskListeners();
  }

  private setupMiddleware(): void {
    // CORS
    if (this.options.cors !== false) {
      this.app.use(cors());
    }

    // Body parsing
    this.app.use(express.json());

    // Request logging
    if (this.options.logRequests) {
      this.app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
      });
    }

    // Authentication middleware
    if (this.options.authToken) {
      this.app.use((req, res, next) => {
        // Skip auth for agent card endpoint
        if (req.path === '/.well-known/agent.json') {
          return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.slice(7);
        if (token !== this.options.authToken) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        next();
      });
    }
  }

  private setupRoutes(): void {
    // Serve Agent Card
    this.app.get('/.well-known/agent.json', (req, res) => {
      res.json(this.agentCard);
    });

    // JSON-RPC 2.0 endpoint
    this.app.post('/a2a/jsonrpc', async (req, res) => {
      await this.handleJsonRpc(req, res);
    });

    // Task streaming endpoint (SSE)
    this.app.get('/a2a/task/:taskId/stream', (req, res) => {
      this.handleTaskStream(req, res);
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ healthy: true, agent: this.agentCard.id });
    });
  }

  private async handleJsonRpc(req: Request, res: Response): Promise<void> {
    const rpcRequest: JSONRPCRequest = req.body;

    // Validate request
    const validation = validateRequest(rpcRequest);
    if (!validation.valid) {
      res.json(
        createErrorResponse(
          rpcRequest.id || 0,
          JSONRPC_ERROR_CODES.INVALID_REQUEST,
          validation.error || 'Invalid request'
        )
      );
      return;
    }

    try {
      const result = await this.handleMethod(rpcRequest.method, rpcRequest.params);
      res.json(createSuccessResponse(rpcRequest.id, result));
    } catch (error: any) {
      res.json(
        createErrorResponse(
          rpcRequest.id,
          JSONRPC_ERROR_CODES.INTERNAL_ERROR,
          error.message || 'Internal error',
          error.details
        )
      );
    }
  }

  private async handleMethod(method: string, params: any): Promise<any> {
    switch (method) {
      case 'task/submit':
        return await this.handleTaskSubmit(params);
      case 'task/status':
        return await this.handleTaskStatus(params);
      case 'task/cancel':
        return await this.handleTaskCancel(params);
      case 'message/send':
        return await this.handleMessageSend(params);
      case 'agent/health':
        return { healthy: true };
      default:
        throw {
          message: `Unknown method: ${method}`,
          code: JSONRPC_ERROR_CODES.METHOD_NOT_FOUND,
        };
    }
  }

  private async handleTaskSubmit(params: any): Promise<Task> {
    const { skill, parameters, clientAgentId } = params;

    // Validate skill exists
    if (!this.skillHandlers.has(skill)) {
      throw { message: `Unknown skill: ${skill}`, code: JSONRPC_ERROR_CODES.INVALID_PARAMS };
    }

    // Create task
    const task = this.taskManager.createTask({
      skill,
      parameters,
      clientAgentId,
      remoteAgentId: this.agentCard.id,
    });

    // Execute skill asynchronously
    this.executeSkill(task);

    return task;
  }

  private async executeSkill(task: Task): Promise<void> {
    try {
      this.taskManager.updateStatus(task.taskId, 'IN_PROGRESS');

      const handler = this.skillHandlers.get(task.skill);
      if (!handler) {
        throw new Error(`Skill handler not found: ${task.skill}`);
      }

      const result = await handler(task.parameters, task);

      this.taskManager.completeTask(task.taskId, result);
    } catch (error: any) {
      this.taskManager.failTask(task.taskId, error.message || 'Execution failed');
    }
  }

  private async handleTaskStatus(params: any): Promise<any> {
    const { taskId } = params;

    const task = this.taskManager.getTask(taskId);
    if (!task) {
      throw { message: `Task not found: ${taskId}`, code: JSONRPC_ERROR_CODES.INVALID_PARAMS };
    }

    return {
      taskId: task.taskId,
      status: task.status,
      artifact: task.artifact,
      error: task.error,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
    };
  }

  private async handleTaskCancel(params: any): Promise<any> {
    const { taskId } = params;

    const task = this.taskManager.getTask(taskId);
    if (!task) {
      throw { message: `Task not found: ${taskId}`, code: JSONRPC_ERROR_CODES.INVALID_PARAMS };
    }

    this.taskManager.cancelTask(taskId);

    return { taskId, status: 'CANCELLED' };
  }

  private async handleMessageSend(params: MessageSendRequest): Promise<any> {
    const { taskId, to, parts } = params;

    const task = this.taskManager.getTask(taskId);
    if (!task) {
      throw { message: `Task not found: ${taskId}`, code: JSONRPC_ERROR_CODES.INVALID_PARAMS };
    }

    const messageId = generateMessageId();

    // In a real implementation, you would send the message to the recipient agent
    // For now, we'll just acknowledge it
    return {
      messageId,
      status: 'sent',
    };
  }

  private handleTaskStream(req: Request, res: Response): void {
    const { taskId } = req.params;

    const task = this.taskManager.getTask(taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Register this client for updates
    if (!this.sseClients.has(taskId)) {
      this.sseClients.set(taskId, []);
    }
    this.sseClients.get(taskId)!.push(res);

    // Send current state
    this.sendSSE(res, {
      taskId: task.taskId,
      status: task.status,
      progress: task.status === 'COMPLETED' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0,
      artifact: task.artifact,
      error: task.error,
    });

    // Handle client disconnect
    req.on('close', () => {
      const clients = this.sseClients.get(taskId);
      if (clients) {
        const index = clients.indexOf(res);
        if (index > -1) {
          clients.splice(index, 1);
        }
        if (clients.length === 0) {
          this.sseClients.delete(taskId);
        }
      }
    });
  }

  private setupTaskListeners(): void {
    this.taskManager.on('task:updated', (task: Task) => {
      this.broadcastTaskUpdate(task);
    });

    this.taskManager.on('task:artifact', (task: Task) => {
      this.broadcastTaskUpdate(task);
    });

    this.taskManager.on('task:error', (task: Task) => {
      this.broadcastTaskUpdate(task);
    });
  }

  private broadcastTaskUpdate(task: Task): void {
    const clients = this.sseClients.get(task.taskId);
    if (!clients || clients.length === 0) return;

    const update: TaskUpdate = {
      taskId: task.taskId,
      status: task.status,
      progress: task.status === 'COMPLETED' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0,
      artifact: task.artifact,
      error: task.error,
    };

    clients.forEach((res) => {
      this.sendSSE(res, update);
    });
  }

  private sendSSE(res: Response, data: any): void {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  /**
   * Start the A2A server
   */
  async start(port?: number): Promise<void> {
    const serverPort = port || this.options.port || 3000;

    return new Promise((resolve) => {
      this.server = this.app.listen(serverPort, () => {
        console.log(`🤖 A2A Server [${this.agentCard.name}] running on port ${serverPort}`);
        console.log(`   Agent Card: http://localhost:${serverPort}/.well-known/agent.json`);
        resolve();
      });
    });
  }

  /**
   * Stop the A2A server
   */
  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          console.log(`A2A Server stopped`);
          resolve();
        });
      });
    }
  }

  /**
   * Get the task manager
   */
  getTaskManager(): TaskManager {
    return this.taskManager;
  }
}

