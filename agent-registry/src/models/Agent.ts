/**
 * Agent Model
 * In-memory agent registry (could be backed by database in production)
 */

import { AgentCard } from '@cms/a2a-sdk';

export type AgentStatus = 'active' | 'inactive' | 'unhealthy';

export interface RegisteredAgent {
  agentCard: AgentCard;
  status: AgentStatus;
  registeredAt: Date;
  lastHealthCheck?: Date;
  healthCheckFailures: number;
  endpoint: string;
}

export class AgentModel {
  private agents: Map<string, RegisteredAgent>;

  constructor() {
    this.agents = new Map();
  }

  /**
   * Register a new agent
   */
  register(agentCard: AgentCard, endpoint: string): RegisteredAgent {
    const registered: RegisteredAgent = {
      agentCard,
      endpoint,
      status: 'active',
      registeredAt: new Date(),
      healthCheckFailures: 0,
    };

    this.agents.set(agentCard.id, registered);
    return registered;
  }

  /**
   * Unregister an agent
   */
  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  /**
   * Get an agent by ID
   */
  get(agentId: string): RegisteredAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAll(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Find agents by capability
   */
  findByCapability(capability: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter(
      (agent) =>
        agent.agentCard.capabilities && agent.agentCard.capabilities.includes(capability)
    );
  }

  /**
   * Find agents by skill
   */
  findBySkill(skillName: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.agentCard.skills.some((skill) => skill.name === skillName)
    );
  }

  /**
   * Update agent status
   */
  updateStatus(agentId: string, status: AgentStatus): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
    }
  }

  /**
   * Update health check
   */
  updateHealthCheck(agentId: string, healthy: boolean): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastHealthCheck = new Date();
      if (healthy) {
        agent.healthCheckFailures = 0;
        agent.status = 'active';
      } else {
        agent.healthCheckFailures++;
        if (agent.healthCheckFailures >= 3) {
          agent.status = 'unhealthy';
        }
      }
    }
  }

  /**
   * Get agents by status
   */
  getByStatus(status: AgentStatus): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter((agent) => agent.status === status);
  }
}

