/**
 * Agent Card Types - A2A Protocol 0.3.0
 * Based on the actual A2A Protocol 0.3.0 specification
 */

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface AgentCapabilities {
  streaming: boolean;
  pushNotifications: boolean;
  stateTransitionHistory: boolean;
  extensions: any[];
}

export interface AgentProvider {
  url: string;
  organization: string;
}

export interface AgentCard {
  name: string;
  url: string;
  version: string;
  protocolVersion: string;
  description: string;
  skills: AgentSkill[];
  iconUrl?: string;
  capabilities: AgentCapabilities;
  provider: AgentProvider;
  documentationUrl?: string;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  supportsAuthenticatedExtendedCard: boolean;
}

export interface AgentRegistration {
  agentCard: AgentCard;
  registeredAt: Date;
  status: 'active' | 'inactive' | 'unhealthy';
  lastHealthCheck?: Date;
}

