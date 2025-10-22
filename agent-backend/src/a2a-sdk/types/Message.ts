/**
 * Message Types - A2A Protocol
 * Agent-to-agent communication within task context
 */

export type MessageType = 'request' | 'response' | 'notification' | 'error' | 'clarification';

export interface MessagePart {
  type: 'text' | 'json' | 'image' | 'file';
  content: any;
}

export interface Message {
  messageId: string;
  taskId: string;
  from: string;
  to: string;
  type: MessageType;
  parts: MessagePart[];
  timestamp: Date;
}

export interface MessageSendRequest {
  taskId: string;
  to: string;
  parts: MessagePart[];
}

export interface MessageSendResponse {
  messageId: string;
  status: 'sent' | 'failed';
  error?: string;
}

