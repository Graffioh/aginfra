export interface AgentRequest {
    prompt: string;
}

export interface AgentResponse {
    text: string;
}

export interface AgentMessage {
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    tool_call_id?: string;
    tool_calls?: AgentToolCall[];
}

export interface AgentToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}
