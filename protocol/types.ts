/**
 * Shared protocol types for inspection system
 * 
 * These types define the contract between:
 * - Agent implementations (via reporter)
 * - Inspection server
 * - Frontend UI
 */

/**
 * Minimal tool call structure compatible with OpenAI/OpenRouter format
 */
export type AgentToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

/**
 * Context message - what gets sent to/from the LLM
 * Note: reasoning is NOT included here as it's inspection-only
 */
export type ContextMessage = {
  role: string; // system, user, assistant, tool
  content?: string | null;
  tool_calls?: AgentToolCall[];
};

/**
 * Child data for structured inspection events
 */
export type InspectionEventChild = {
  label: string;
  data: string;
};

/**
 * Inspection event - structured format for inspection messages
 * If children is present, it's a trace event (use label).
 * If children is absent, it's a log event (use message).
 */
export type InspectionEvent = {
  label?: string;
  message?: string;
  children?: InspectionEventChild[];
};

/**
 * JSON Schema for tool definitions
 */
export type JSONSchema = {
  type: "object" | "string" | "number" | "boolean" | "array";
  properties?: Record<string, JSONSchema>;
  required?: string[];
  description?: string;
  items?: JSONSchema;
};

/**
 * Agent tool definition (OpenAI/OpenRouter compatible)
 */
export type AgentToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: JSONSchema;
  };
};

/**
 * Token usage information
 */
export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  contextLimit: number | null;
  remainingTokens: number | null;
};

