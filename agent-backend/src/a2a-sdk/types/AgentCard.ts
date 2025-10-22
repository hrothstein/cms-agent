/**
 * Agent Card Types - A2A Protocol
 * Based on Google's Agent-to-Agent Protocol specification
 */

export interface AgentSkill {
  name: string;
  description: string;
  parameters: Record<string, SkillParameter>;
  returns: Record<string, SkillReturn>;
}

export interface SkillParameter {
  type: string;
  required?: boolean;
  description?: string;
}

export interface SkillReturn {
  type: string;
  description?: string;
}

export interface AgentEndpoints {
  task_submit: string;
  task_status?: string;
  task_stream?: string;
}

export interface AgentAuthentication {
  type: 'Bearer' | 'API-Key' | 'None';
  required: boolean;
}

export interface AgentCard {
  id: string;
  name: string;
  description: string;
  version: string;
  skills: AgentSkill[];
  endpoints: AgentEndpoints;
  supported_protocols?: string[];
  authentication?: AgentAuthentication;
  capabilities?: string[];
  metadata?: Record<string, any>;
}

export interface AgentRegistration {
  agentCard: AgentCard;
  registeredAt: Date;
  status: 'active' | 'inactive' | 'unhealthy';
  lastHealthCheck?: Date;
}

