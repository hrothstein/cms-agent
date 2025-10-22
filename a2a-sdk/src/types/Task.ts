/**
 * Task Types - A2A Protocol
 * Task lifecycle and management
 */

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Task {
  taskId: string;
  clientAgentId: string;
  remoteAgentId: string;
  skill: string;
  parameters: Record<string, any>;
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
  artifact?: TaskArtifact;
  error?: TaskError;
  retryCount?: number;
}

export interface TaskArtifact {
  artifactId: string;
  taskId: string;
  contentType: string;
  content: any;
  createdAt: Date;
}

export interface TaskError {
  code: string;
  message: string;
  details?: any;
}

export interface TaskSubmission {
  skill: string;
  parameters: Record<string, any>;
  clientAgentId: string;
}

export interface TaskStatusResponse {
  taskId: string;
  status: TaskStatus;
  artifact?: TaskArtifact;
  error?: TaskError;
  progress?: number;
  estimatedCompletionTime?: Date;
}

export interface TaskUpdate {
  taskId: string;
  status: TaskStatus;
  progress?: number;
  message?: string;
  artifact?: TaskArtifact;
  error?: TaskError;
}

