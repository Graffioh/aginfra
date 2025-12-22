import type { AgentToolCall } from "../protocol/types";

export type AgentRequest = {
    prompt: string;
};

export type AgentResponse = {
    text: string;
};

export type AgentMessage = {
    role: "user" | "assistant" | "system" | "tool" | string;
    content?: string | null;
    tool_call_id?: string;
    tool_calls?: AgentToolCall[];
    reasoning?: string | null;
};