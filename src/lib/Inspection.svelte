<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  type InspectionEvent = {
    id: number;
    ts: number;
    data: string;
    expanded?: boolean;
  };

  let events: InspectionEvent[] = $state([]);
  let status = $state<"connecting" | "connected" | "error">("connecting");
  let lastError = $state<string | null>(null);
  let eventId = $state(0);

  let eventSource: EventSource | null = null;

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3002/api";

  function pushEvent(data: string) {
    const next = [
      ...events,
      { id: eventId++, ts: Date.now(), data, expanded: false },
    ];
    events = next.length > 300 ? next.slice(next.length - 300) : next;
  }

  function isMultiline(data: string): boolean {
    return data.includes("\n");
  }

  function getFirstLine(data: string): string {
    return data.split("\n")[0];
  }

  function toggleExpand(event: InspectionEvent) {
    event.expanded = !event.expanded;
  }

  function buildInspectionSnapshot(): string {
    if (events.length === 0) {
      return "No events yet.\n";
    }
    return events
      .map((e) => {
        const timestamp = new Date(e.ts).toLocaleString();
        return `[${timestamp}] ${e.data}`;
      })
      .join("\n");
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

  onMount(() => {
    eventSource = new EventSource(BACKEND_URL + "/agent/events/inspection");

    eventSource.onopen = () => {
      status = "connected";
      lastError = null;
    };

    eventSource.onmessage = (event: MessageEvent) => {
      pushEvent(String(event.data ?? ""));
    };

    eventSource.onerror = () => {
      status = "error";
      lastError = "SSE connection error";
    };
  });

  onDestroy(() => {
    eventSource?.close();
    eventSource = null;
  });
</script>

<div id="inspection">
  <div class="header">
    <div class="title-section">
      <div class="title">Agent inspection</div>
      <div class="model">openai/gpt-oss-120b</div>
    </div>
    <div class="header-right-half">
      <button
        class="download-button"
        onclick={downloadInspectionSnapshot}
        title="Download inspection log"
      >
        download txt snapshot ⬇
      </button>
      <div class="pill {status}">
        {#if status === "connecting"}Connecting...{/if}
        {#if status === "connected"}Live{/if}
        {#if status === "error"}Error{/if}
      </div>
    </div>
  </div>

  {#if lastError}
    <div class="error">{lastError}</div>
  {/if}

  <div class="stream">
    {#if events.length === 0}
      <div class="empty">No events yet.</div>
    {:else}
      {#each events as e (e.id)}
        {@const isExpanded = e.expanded ?? false}
        {@const multiline = isMultiline(e.data)}
        <div class="row">
          <div class="ts">{new Date(e.ts).toLocaleTimeString()}</div>
          <div class="data-container">
            {#if multiline}
              <button class="expand-button" onclick={() => toggleExpand(e)}>
                <span class="arrow {isExpanded ? 'expanded' : ''}">▶</span>
              </button>
            {/if}
            <pre class="data {isExpanded ? '' : 'collapsed'}">{isExpanded ||
              !multiline
                ? e.data
                : getFirstLine(e.data)}</pre>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <div class="footer">
    <img src="/dumb.svg" alt="" class="dumb-icon" />
    <span class="dumb-text">my agent is dumb (version 0)</span>
  </div>
</div>

<style>
  #inspection {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: rgb(0, 0, 0);
    color: #e6edf3;
    box-sizing: border-box;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(214, 214, 214, 0.224);
    background: rgba(255, 255, 255, 0.03);
  }

  .header-right-half {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .title {
    font-weight: 600;
    font-size: 14px;
  }

  .model {
    font-size: 11px;
    color: rgba(230, 237, 243, 0.6);
    font-family: monospace;
  }

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

  .pill {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #c9d1d9;
  }
  .pill.connected {
    border-color: rgba(46, 160, 67, 0.6);
    color: #7ee787;
  }
  .pill.connecting {
    border-color: rgba(210, 153, 34, 0.7);
    color: #f2cc60;
  }
  .pill.error {
    border-color: rgba(248, 81, 73, 0.7);
    color: #ff7b72;
  }

  .error {
    padding: 8px 12px;
    font-size: 12px;
    color: #ff7b72;
    border-bottom: 1px solid rgba(214, 214, 214, 0.224);
  }

  .stream {
    flex: 1;
    overflow: auto;
    padding: 10px 12px;
  }

  .empty {
    color: rgba(230, 237, 243, 0.7);
    font-size: 13px;
  }

  .row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 10px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(214, 214, 214, 0.153);
  }

  .ts {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.65);
  }

  .data-container {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  .expand-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: rgba(230, 237, 243, 0.65);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .expand-button:hover {
    color: #e6edf3;
  }

  .arrow {
    font-size: 10px;
    transition: transform 0.2s;
    display: inline-block;
  }

  .arrow.expanded {
    transform: rotate(90deg);
  }

  .data {
    margin: 0;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-word;
    color: #e6edf3;
    flex: 1;
  }

  .data.collapsed {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid rgba(214, 214, 214, 0.224);
    background: rgba(255, 255, 255, 0.03);
  }

  .dumb-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .dumb-text {
    font-size: 12px;
    font-weight: bold;
    color: #e6edf3;
  }
</style>
