/**
 * Orchestrator Service
 * Coordinates multiple specialist agents using A2A Protocol
 */

import { A2AClient } from '../a2a-sdk/client/A2AClient';
import { AgentCard } from '../a2a-sdk/types/AgentCard';
import { Task } from '../a2a-sdk/types/Task';
import axios from 'axios';

const REGISTRY_URL = process.env.AGENT_REGISTRY_URL || 'http://localhost:3001';

export interface AgentDelegate {
  agentId: string;
  agentName: string;
  client: A2AClient;
  card: AgentCard;
}

export interface TaskResult {
  agentId: string;
  agentName: string;
  skill: string;
  result: any;
  success: boolean;
  error?: string;
}

export class OrchestratorService {
  private agents: Map<string, AgentDelegate>;
  private discoveryEnabled: boolean;

  constructor() {
    this.agents = new Map();
    this.discoveryEnabled = process.env.A2A_ENABLED === 'true';
  }

  /**
   * Discover agents from registry
   */
  async discoverAgents(): Promise<AgentCard[]> {
    if (!this.discoveryEnabled) {
      return [];
    }

    try {
      const response = await axios.get(`${REGISTRY_URL}/api/v1/agents?status=active`);
      
      if (!response.data.success) {
        console.warn('Failed to discover agents from registry');
        return [];
      }

      const registeredAgents = response.data.data;

      // Create A2A clients for each agent
      for (const registered of registeredAgents) {
        const client = new A2AClient(registered.endpoint);
        
        // Try to fetch agent card
        try {
          const card = await client.discoverAgent();
          
          this.agents.set(card.id, {
            agentId: card.id,
            agentName: card.name,
            client,
            card,
          });

          console.log(`✅ Discovered agent: ${card.name} (${card.id})`);
        } catch (error) {
          console.warn(`Failed to discover agent at ${registered.endpoint}:`, error);
        }
      }

      return Array.from(this.agents.values()).map((a) => a.card);
    } catch (error: any) {
      console.warn('Failed to connect to agent registry:', error.message);
      return [];
    }
  }

  /**
   * Find agents by skill
   */
  findAgentsBySkill(skillName: string): AgentDelegate[] {
    const matching: AgentDelegate[] = [];

    for (const agent of this.agents.values()) {
      const hasSkill = agent.card.skills.some((skill: any) => skill.name === skillName);
      if (hasSkill) {
        matching.push(agent);
      }
    }

    return matching;
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability: string): AgentDelegate[] {
    const matching: AgentDelegate[] = [];

    for (const agent of this.agents.values()) {
      if (agent.card.capabilities && agent.card.capabilities.includes(capability)) {
        matching.push(agent);
      }
    }

    return matching;
  }

  /**
   * Get all available agents
   */
  getAvailableAgents(): AgentDelegate[] {
    return Array.from(this.agents.values());
  }

  /**
   * Delegate a task to a specific agent
   */
  async delegateTask(
    agentId: string,
    skill: string,
    parameters: Record<string, any>
  ): Promise<TaskResult> {
    const agent = this.agents.get(agentId);

    if (!agent) {
      return {
        agentId,
        agentName: 'Unknown',
        skill,
        result: null,
        success: false,
        error: `Agent not found: ${agentId}`,
      };
    }

    try {
      // Submit task
      const task = await agent.client.submitTask(skill, parameters, 'orchestrator-agent');

      // Poll for completion
      const result = await this.waitForTaskCompletion(agent.client, task.taskId);

      return {
        agentId: agent.agentId,
        agentName: agent.agentName,
        skill,
        result: result.artifact?.content,
        success: result.status === 'COMPLETED',
        error: result.error?.message,
      };
    } catch (error: any) {
      return {
        agentId: agent.agentId,
        agentName: agent.agentName,
        skill,
        result: null,
        success: false,
        error: error.message || 'Task execution failed',
      };
    }
  }

  /**
   * Delegate tasks to multiple agents in parallel
   */
  async delegateTasksParallel(
    tasks: Array<{
      agentId: string;
      skill: string;
      parameters: Record<string, any>;
    }>
  ): Promise<TaskResult[]> {
    const promises = tasks.map((task) =>
      this.delegateTask(task.agentId, task.skill, task.parameters)
    );

    return await Promise.all(promises);
  }

  /**
   * Wait for a task to complete (with polling)
   */
  private async waitForTaskCompletion(
    client: A2AClient,
    taskId: string,
    maxWaitMs: number = 30000
  ): Promise<any> {
    const startTime = Date.now();
    const pollInterval = 1000; // 1 second

    while (Date.now() - startTime < maxWaitMs) {
      const status = await client.getTaskStatus(taskId);

      if (status.status === 'COMPLETED' || status.status === 'FAILED' || status.status === 'CANCELLED') {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Task timeout');
  }

  /**
   * Format agents for LLM context
   */
  formatAgentsForLLM(): string {
    if (this.agents.size === 0) {
      return 'No specialist agents available. Using direct MCP tools only.';
    }

    let formatted = 'Available Specialist Agents:\n\n';

    for (const agent of this.agents.values()) {
      formatted += `**${agent.agentName}** (${agent.agentId})\n`;
      formatted += `  Description: ${agent.card.description}\n`;
      formatted += `  Skills:\n`;
      
      for (const skill of agent.card.skills) {
        formatted += `    - ${skill.name}: ${skill.description}\n`;
        formatted += `      Parameters: ${Object.keys(skill.parameters).join(', ')}\n`;
      }
      
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Check if A2A is enabled
   */
  isA2AEnabled(): boolean {
    return this.discoveryEnabled && this.agents.size > 0;
  }

  /**
   * Get agent count
   */
  getAgentCount(): number {
    return this.agents.size;
  }
}

