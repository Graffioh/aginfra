<script lang="ts">
  import type { InspectionEventDisplay } from "../types";
  import type {
    InspectionEventChild,
    ContextMessage,
    AgentToolDefinition,
    TokenUsage,
  } from "../../protocol/types";
  import { getSnapshotState } from "../utils/inspectionSnapshotState";

  interface Props {
    events: InspectionEventDisplay[];
    modelName: string;
  }

  let { events, modelName }: Props = $props();
  let isLoading = $state(false);

  function formatChild(
    child: InspectionEventChild,
    indent: string = "  "
  ): string {
    return `${indent}${child.label}:\n${indent}  ${child.data.split("\n").join(`\n${indent}  `)}`;
  }

  function formatEvent(event: InspectionEventDisplay): string {
    const timestamp = new Date(event.ts).toLocaleString();
    const displayText = event.inspectionEvent.message || event.data;
    const warningMarkPrefix = event.warningMarked
      ? "[⚠ WARNING, STRANGE BEHAVIOR] "
      : "";

    let result = `[${timestamp}] ${warningMarkPrefix}${displayText}`;

    if (
      event.inspectionEvent.children &&
      event.inspectionEvent.children.length > 0
    ) {
      result += "\n";
      result += event.inspectionEvent.children
        .map((child) => formatChild(child))
        .join("\n");
    }

    return result;
  }

  function formatContextMessage(msg: ContextMessage, idx: number): string {
    const role = msg.role.toUpperCase();
    let content = "";

    if ("tool_calls" in msg && msg.tool_calls) {
      content = JSON.stringify(msg.tool_calls, null, 2);
    } else if ("content" in msg && msg.content) {
      content = msg.content;
    } else {
      content = "(empty)";
    }

    return `[${idx + 1}] ${role}\n${content}`;
  }

  function formatToolDefinition(tool: AgentToolDefinition): string {
    return `• ${tool.function.name}\n  ${tool.function.description}\n  Parameters: ${JSON.stringify(tool.function.parameters, null, 2).split("\n").join("\n  ")}`;
  }

  function formatTokenUsage(tokenUsage: TokenUsage): string {
    const lines: string[] = [];
    lines.push(`Total Tokens: ${tokenUsage.totalTokens}`);
    if (tokenUsage.promptTokens != null) {
      lines.push(`Prompt Tokens: ${tokenUsage.promptTokens}`);
    }
    if (tokenUsage.modelOutputTokens != null) {
      lines.push(`Output Tokens: ${tokenUsage.modelOutputTokens}`);
    }
    if (tokenUsage.modelReasoningTokens != null) {
      lines.push(`Reasoning Tokens: ${tokenUsage.modelReasoningTokens}`);
    }
    if (tokenUsage.contextLimit != null) {
      lines.push(`Context Limit: ${tokenUsage.contextLimit}`);
    }
    if (tokenUsage.remainingTokens != null) {
      lines.push(`Remaining Tokens: ${tokenUsage.remainingTokens}`);
    }
    return lines.join("\n");
  }

  function getCurrentData(): {
    context: ContextMessage[];
    tools: AgentToolDefinition[];
    tokenUsage: TokenUsage;
  } {
    // Mirrors the *in-memory* state from `CurrentContext.svelte`.
    return getSnapshotState();
  }

  function buildInspectionSnapshot(data: {
    context: ContextMessage[];
    tools: AgentToolDefinition[];
    tokenUsage: TokenUsage;
  }): string {
    const sections: string[] = [];
    const separator = "═".repeat(60);
    const timestamp = new Date().toLocaleString();

    // Header
    sections.push(`MAID INSPECTION SNAPSHOT`);
    sections.push(`Generated: ${timestamp}`);
    if (modelName) {
      sections.push(`Model: ${modelName}`);
    }
    sections.push(separator);

    // Token Usage Section
    sections.push("\n📊 TOKEN USAGE\n");
    sections.push(formatTokenUsage(data.tokenUsage));
    sections.push("\n" + separator);

    // Tools Section
    sections.push("\n🔧 AVAILABLE TOOLS\n");
    if (data.tools.length === 0) {
      sections.push("No tools defined.");
    } else {
      sections.push(`${data.tools.length} tool(s) available:\n`);
      sections.push(data.tools.map(formatToolDefinition).join("\n\n"));
    }
    sections.push("\n" + separator);

    // Context Messages Section
    sections.push("\n💬 CONTEXT MESSAGES\n");
    if (data.context.length === 0) {
      sections.push("No messages in context.");
    } else {
      sections.push(`${data.context.length} message(s):\n`);
      sections.push(
        data.context
          .map((msg, idx) => formatContextMessage(msg, idx))
          .join("\n\n")
      );
    }
    sections.push("\n" + separator);

    // Inspection Events Section
    sections.push("\n📋 INSPECTION EVENTS (TRACE)\n");
    if (events.length === 0) {
      sections.push("No inspection events yet.");
    } else {
      sections.push(`${events.length} event(s):\n`);
      sections.push(events.map(formatEvent).join("\n\n"));
    }

    return sections.join("\n");
  }

  async function downloadInspectionSnapshot() {
    isLoading = true;
    try {
      const data = getCurrentData();
      const content = buildInspectionSnapshot(data);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "maid-inspection-snap.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate snapshot:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<button
  class="download-button"
  onclick={downloadInspectionSnapshot}
  title="Download full inspection snapshot"
  disabled={isLoading}
>
  {isLoading ? "loading..." : "txt snapshot ⬇"}
</button>

<style>
  .download-button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 4px;
    color: #c9d1d9;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .download-button:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: #e6edf3;
    background: rgba(255, 255, 255, 0.05);
  }

  .download-button:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  .download-button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
</style>
