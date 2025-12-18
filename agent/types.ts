export type AgentRequest = {
    prompt: string;
}

export type AgentResponse = {
    text: string;
}

export type AgentMessage = {
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    tool_call_id?: string;
    tool_calls?: AgentToolCall[];
}

export type AgentToolCall = {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}

export type InspectionEvent = {
    id: number;
    ts: number;
    data: string;
    expanded?: boolean;
  };
