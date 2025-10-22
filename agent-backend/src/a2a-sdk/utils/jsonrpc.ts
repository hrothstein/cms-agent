/**
 * JSON-RPC 2.0 Utilities
 * Implements JSON-RPC 2.0 specification for A2A Protocol
 */

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: JSONRPCError;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

// Standard JSON-RPC 2.0 error codes
export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR: -32000, // -32000 to -32099 are reserved for implementation-defined server-errors
} as const;

let requestIdCounter = 0;

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req-${Date.now()}-${++requestIdCounter}`;
}

/**
 * Create a JSON-RPC 2.0 request
 */
export function createRequest(method: string, params?: any): JSONRPCRequest {
  return {
    jsonrpc: '2.0',
    id: generateRequestId(),
    method,
    params,
  };
}

/**
 * Create a successful JSON-RPC 2.0 response
 */
export function createSuccessResponse(id: string | number, result: any): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

/**
 * Create an error JSON-RPC 2.0 response
 */
export function createErrorResponse(
  id: string | number,
  code: number,
  message: string,
  data?: any
): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data,
    },
  };
}

/**
 * Validate a JSON-RPC 2.0 request
 */
export function validateRequest(req: any): { valid: boolean; error?: string } {
  if (!req || typeof req !== 'object') {
    return { valid: false, error: 'Request must be an object' };
  }

  if (req.jsonrpc !== '2.0') {
    return { valid: false, error: 'Invalid JSON-RPC version' };
  }

  if (!req.id) {
    return { valid: false, error: 'Request ID is required' };
  }

  if (!req.method || typeof req.method !== 'string') {
    return { valid: false, error: 'Method must be a string' };
  }

  return { valid: true };
}

/**
 * Validate a JSON-RPC 2.0 response
 */
export function validateResponse(res: any): { valid: boolean; error?: string } {
  if (!res || typeof res !== 'object') {
    return { valid: false, error: 'Response must be an object' };
  }

  if (res.jsonrpc !== '2.0') {
    return { valid: false, error: 'Invalid JSON-RPC version' };
  }

  if (!res.id) {
    return { valid: false, error: 'Response ID is required' };
  }

  if (!res.result && !res.error) {
    return { valid: false, error: 'Response must have either result or error' };
  }

  if (res.result && res.error) {
    return { valid: false, error: 'Response cannot have both result and error' };
  }

  return { valid: true };
}

