export type TokenUsage = {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    contextLimit: number | null;
    remainingTokens: number | null;
}

export type ContextMessage = {
    role: string;
    content: string;
    tool_calls?: any[];
};
