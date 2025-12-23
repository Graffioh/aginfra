import type { InspectionEvent } from "../protocol/types";

// *** Frontend-specific types ***
export type ChatMessage = { role: "user" | "assistant"; content: string };

export type InspectionEventDisplay = {
  id: number;
  ts: number;
  data: string;
  expanded: boolean;
  warningMarked: boolean;
  inspectionEvent: InspectionEvent;
};

export type TokenUsage = {
  contextLimit: number | null;
  remainingTokens: number | null;
};
// **********************
