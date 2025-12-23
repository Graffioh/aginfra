<script lang="ts">
  import type { InspectionEventDisplay } from "../types";
  import type { InspectionEventChild } from "../../protocol/types";

  interface Props {
    events: InspectionEventDisplay[];
  }

  let { events }: Props = $props();

  function formatChild(child: InspectionEventChild, indent: string = "  "): string {
    return `${indent}${child.label}:\n${indent}  ${child.data.split("\n").join(`\n${indent}  `)}`;
  }

  function formatEvent(event: InspectionEventDisplay): string {
    const timestamp = new Date(event.ts).toLocaleString();
    const displayText = event.inspectionEvent.message || event.data;
    const warningMarkPrefix = event.warningMarked ? "[⚠ WARNING, STRANGE BEHAVIOR] " : "";
    
    let result = `[${timestamp}] ${warningMarkPrefix}${displayText}`;
    
    if (event.inspectionEvent.children && event.inspectionEvent.children.length > 0) {
      result += "\n";
      result += event.inspectionEvent.children
        .map((child) => formatChild(child))
        .join("\n");
    }
    
    return result;
  }

  function buildInspectionSnapshot(): string {
    if (events.length === 0) {
      return "No inspection events yet.\n";
    }
    return events.map(formatEvent).join("\n\n");
  }

  function downloadInspectionSnapshot() {
    const content = buildInspectionSnapshot();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inspection-snapshot.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<button
  class="download-button"
  onclick={downloadInspectionSnapshot}
  title="Download inspection log"
>
  txt trace snapshot ⬇
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

  .download-button:active {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
