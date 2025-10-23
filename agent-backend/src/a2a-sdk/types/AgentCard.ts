/**
 * Agent Card Types - A2A Protocol
 * Based on Google's Agent-to-Agent Protocol specification
 */

export interface AgentSkill {
  id: string;  // Added for A2A 0.3.0
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

// A2A 0.3.0 Capabilities
export interface AgentCapabilities {
  streaming?: boolean;
  push_notifications?: boolean;
  batch_operations?: boolean;
}

// A2A 0.3.0 Security Schemes
export interface SecurityScheme {
  type: string;
  scheme?: string;
  bearer_format?: string;
  in?: string;
  name?: string;
}

export interface AgentCard {
  protocol_version?: string;  // Added for A2A 0.3.0
  id: string;
  name: string;
  description: string;
  version: string;
  skills: AgentSkill[];
  endpoints: AgentEndpoints;
  supported_protocols?: string[];
  
  // Legacy authentication (pre-0.3.0)
  authentication?: AgentAuthentication;
  
  // A2A 0.3.0 security
  security_schemes?: Record<string, SecurityScheme>;
  security?: any[];
  
  // A2A 0.3.0 capabilities (object, not array)
  capabilities?: AgentCapabilities | string[];
  
  metadata?: Record<string, any>;
}

export interface AgentRegistration {
  agentCard: AgentCard;
  registeredAt: Date;
  status: 'active' | 'inactive' | 'unhealthy';
  lastHealthCheck?: Date;
}

