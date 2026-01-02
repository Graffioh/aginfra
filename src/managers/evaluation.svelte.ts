import type { EvaluationResult } from "../../protocol/types";

export type EvaluationState = {
  isLoading: boolean;
  result: EvaluationResult | null;
  error: string | null;
  userQuery: string | null;
  agentResponse: string | null;
};

function createEvaluationManager() {
  let state = $state<EvaluationState>({
    isLoading: false,
    result: null,
    error: null,
    userQuery: null,
    agentResponse: null,
  });

  let customSystemPrompt = $state("");

  return {
    get state() {
      return state;
    },
    get customSystemPrompt() {
      return customSystemPrompt;
    },
    set customSystemPrompt(value: string) {
      customSystemPrompt = value;
    },
    setCustomSystemPrompt(prompt: string) {
      customSystemPrompt = prompt;
    },
    async evaluate(userQuery: string, agentResponse: string, systemPrompt?: string): Promise<EvaluationResult | null> {
      state.isLoading = true;
      state.error = null;
      state.result = null;
      state.userQuery = userQuery;
      state.agentResponse = agentResponse;

      // Use event's system prompt first, then fall back to custom system prompt
      const effectiveSystemPrompt = systemPrompt || (customSystemPrompt.trim() || undefined);

      try {
        const response = await fetch("http://localhost:6969/api/inspection/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userQuery, agentResponse, systemPrompt: effectiveSystemPrompt }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        state.result = data.evaluation;
        return data.evaluation;
      } catch (e) {
        state.error = e instanceof Error ? e.message : "Evaluation failed";
        return null;
      } finally {
        state.isLoading = false;
      }
    },
    clear() {
      state.result = null;
      state.error = null;
      state.userQuery = null;
      state.agentResponse = null;
    },
  };
}

export const evaluationManager = createEvaluationManager();
