/**
 * Registry Service
 * Handles agent registration, discovery, and health checks
 */

import { A2AClient, AgentCard } from '@cms/a2a-sdk';
import { AgentModel, RegisteredAgent, AgentStatus } from '../models/Agent';

export class RegistryService {
  private agentModel: AgentModel;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor() {
    this.agentModel = new AgentModel();
  }

  /**
   * Register an agent
   */
  async registerAgent(endpoint: string): Promise<RegisteredAgent> {
    // Discover agent by fetching its Agent Card
    const client = new A2AClient(endpoint);
    const agentCard = await client.discoverAgent();

    // Validate agent card
    this.validateAgentCard(agentCard);

    // Register in model
    const registered = this.agentModel.register(agentCard, endpoint);

    console.log(`✅ Agent registered: ${agentCard.name} (${agentCard.id})`);

    return registered;
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: string): boolean {
    const success = this.agentModel.unregister(agentId);
    if (success) {
      console.log(`❌ Agent unregistered: ${agentId}`);
    }
    return success;
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): RegisteredAgent | undefined {
    return this.agentModel.get(agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents(): RegisteredAgent[] {
    return this.agentModel.getAll();
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability: string): RegisteredAgent[] {
    return this.agentModel.findByCapability(capability);
  }

  /**
   * Find agents by skill
   */
  findAgentsBySkill(skillName: string): RegisteredAgent[] {
    return this.agentModel.findBySkill(skillName);
  }

  /**
   * Get agents by status
   */
  getAgentsByStatus(status: AgentStatus): RegisteredAgent[] {
    return this.agentModel.getByStatus(status);
  }

  /**
   * Perform health check on an agent
   */
  async healthCheckAgent(agentId: string): Promise<boolean> {
    const agent = this.agentModel.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    try {
      const client = new A2AClient(agent.endpoint);
      const healthy = await client.healthCheck();

      this.agentModel.updateHealthCheck(agentId, healthy);

      return healthy;
    } catch (error) {
      this.agentModel.updateHealthCheck(agentId, false);
      return false;
    }
  }

  /**
   * Perform health checks on all agents
   */
  async healthCheckAll(): Promise<void> {
    const agents = this.agentModel.getAll();

    const checks = agents.map(async (agent) => {
      try {
        await this.healthCheckAgent(agent.agentCard.id);
      } catch (error) {
        console.error(`Health check failed for ${agent.agentCard.id}:`, error);
      }
    });

    await Promise.all(checks);
  }

  /**
   * Start periodic health checks
   */
  startPeriodicHealthChecks(intervalMs: number = 60000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      console.log('🏥 Running periodic health checks...');
      await this.healthCheckAll();
    }, intervalMs);

    console.log(`🏥 Periodic health checks started (every ${intervalMs / 1000}s)`);
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
      console.log('🏥 Periodic health checks stopped');
    }
  }

  /**
   * Validate agent card format
   */
  private validateAgentCard(agentCard: AgentCard): void {
    if (!agentCard.id) {
      throw new Error('Agent card must have an id');
    }
    if (!agentCard.name) {
      throw new Error('Agent card must have a name');
    }
    if (!agentCard.version) {
      throw new Error('Agent card must have a version');
    }
    if (!agentCard.skills || !Array.isArray(agentCard.skills)) {
      throw new Error('Agent card must have skills array');
    }
    if (!agentCard.endpoints || !agentCard.endpoints.task_submit) {
      throw new Error('Agent card must have task_submit endpoint');
    }
  }

  /**
   * Get registry statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    inactive: number;
    unhealthy: number;
  } {
    const all = this.agentModel.getAll();
    return {
      total: all.length,
      active: all.filter((a) => a.status === 'active').length,
      inactive: all.filter((a) => a.status === 'inactive').length,
      unhealthy: all.filter((a) => a.status === 'unhealthy').length,
    };
  }
}

