export type TokenUsage = {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    contextLimit: number | null;
    remainingTokens: number | null;
}

import type { AgentToolCall } from "../agent/types";

export type ContextMessage = {
    role: string;
    content: string;
    tool_calls?: AgentToolCall[];
};
