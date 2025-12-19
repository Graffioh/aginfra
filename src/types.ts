// *** Frontend types ***
export type ChatMessage = { role: "user" | "assistant"; content: string };

export type InspectionEvent = {
  id: number;
  ts: number;
  data: string;
  expanded: boolean;
};

export type TokenUsage = {
  contextLimit: number | null;
  remainingTokens: number | null;
};
// **********************

// *** Agent tool definition type ***
export type JSONSchema = {
  type: "object" | "string" | "number" | "boolean" | "array";
  properties?: Record<string, JSONSchema>;
  required?: string[];
  description?: string;
  items?: JSONSchema;
};

export type AgentToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: JSONSchema;
  };
};
// **********************

// *** Context message type ***
export type ContextMessage = {
  role: string;
  content: string;
  tool_calls?: unknown[];
};
// **********************
