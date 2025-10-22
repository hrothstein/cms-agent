/**
 * ID Generation Utilities
 */

import { randomBytes } from 'crypto';

/**
 * Generate a unique task ID
 */
export function generateTaskId(): string {
  return `task-${Date.now()}-${randomBytes(4).toString('hex')}`;
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${randomBytes(4).toString('hex')}`;
}

/**
 * Generate a unique artifact ID
 */
export function generateArtifactId(): string {
  return `artifact-${Date.now()}-${randomBytes(4).toString('hex')}`;
}

/**
 * Generate a unique agent ID
 */
export function generateAgentId(type: string): string {
  return `${type}-agent-${randomBytes(4).toString('hex')}`;
}

