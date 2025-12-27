<script lang="ts">
  import EventRow from "./EventRow.svelte";
  import type { InspectionEventDisplay } from "../types";
  import { InspectionEventLabel } from "../../protocol/types";

  type InvocationGroup = {
    invocationId: string;
    events: InspectionEventDisplay[];
    firstTs: number;
    lastTs: number;
  };

  type StreamItem =
    | { type: "group"; group: InvocationGroup }
    | { type: "ungrouped"; event: InspectionEventDisplay };

  let streamElement: HTMLDivElement | null = null;
  const {
    events,
    highlightedEventId,
    onToggleExpand,
    onRemove,
    onToggleWarningMark,
  } = $props();

  let previousEventCount = 0;

  // Track which invocation groups are expanded (by invocationId)
  let expandedGroups = $state<Set<string>>(new Set());

  // Derive stream items: groups for events with invocationId, individual items for those without
  const streamItems = $derived.by<StreamItem[]>(() => {
    const groupMap = new Map<string, InvocationGroup>();

    for (const event of events) {
      if (event.invocationId) {
        let group = groupMap.get(event.invocationId);
        if (!group) {
          group = {
            invocationId: event.invocationId,
            events: [],
            firstTs: event.ts,
            lastTs: event.ts,
          };
          groupMap.set(event.invocationId, group);
        }
        group.events.push(event);
        group.lastTs = event.ts;
      }
    }

    // Insert groups at their first occurrence position
    const result: StreamItem[] = [];
    for (const event of events) {
      if (event.invocationId) {
        // Check if this is the first event of this group
        const group = groupMap.get(event.invocationId)!;
        if (group.events[0].id === event.id) {
          result.push({ type: "group", group });
        }
      } else {
        result.push({ type: "ungrouped", event });
      }
    }

    return result;
  });

  function toggleGroup(invocationId: string) {
    const next = new Set(expandedGroups);
    if (next.has(invocationId)) {
      next.delete(invocationId);
    } else {
      next.add(invocationId);
    }
    expandedGroups = next;
  }

  function formatDuration(startTs: number, endTs: number): string {
    const ms = Math.max(0, endTs - startTs);
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }

  function groupHasToolCalls(group: InvocationGroup): boolean {
    return group.events.some(e => 
      e.inspectionEvent.children?.some(child => child.label === InspectionEventLabel.ToolCalls)
    );
  }



  // Auto-scroll only when new events are added
  $effect(() => {
    if (!streamElement) return;

    const currentCount = events.length;

    if (currentCount > previousEventCount) {
      streamElement.scrollTop = streamElement.scrollHeight;
    }

    previousEventCount = currentCount;
  });

  // Scroll to highlighted event
  $effect(() => {
    if (!streamElement || highlightedEventId === null) return;

    const eventElement = streamElement.querySelector<HTMLElement>(
      `[data-event-id="${highlightedEventId}"]`
    );

    eventElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
</script>

<div class="stream" bind:this={streamElement}>
  {#if events.length === 0}
    <div class="empty">No inspection events yet.</div>
  {:else}
    {#each streamItems as item (item.type === 'group' ? `g-${item.group.invocationId}` : `e-${item.event.id}`)}
      {#if item.type === "ungrouped"}
        <EventRow
          event={item.event}
          highlighted={highlightedEventId === item.event.id}
          {onToggleExpand}
          {onRemove}
          {onToggleWarningMark}
        />
      {:else}
        {@const group = item.group}
        {@const isExpanded = expandedGroups.has(group.invocationId)}
        {@const hasHighlighted = group.events.some(e => e.id === highlightedEventId)}
        <div class="invocation-group" class:highlighted={hasHighlighted && !isExpanded}>
          <button
            class="group-header"
            type="button"
            onclick={() => toggleGroup(group.invocationId)}
          >
            <span class="group-arrow" class:expanded={isExpanded}>▶</span>
            <span class="group-id" title={group.invocationId}>
              {group.invocationId.slice(0, 8)}
            </span>
            {#if groupHasToolCalls(group)}
              <span class="tool-badge" title="Contains tool calls">T</span>
            {/if}
            <span class="group-meta">
              {group.events.length} events • {formatDuration(group.firstTs, group.lastTs)}
            </span>
            <span class="group-time">
              {new Date(group.firstTs).toLocaleTimeString()}
            </span>
          </button>
          {#if isExpanded}
            <div class="group-events">
              {#each group.events as e (e.id)}
                <EventRow
                  event={e}
                  highlighted={highlightedEventId === e.id}
                  {onToggleExpand}
                  {onRemove}
                  {onToggleWarningMark}
                />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .stream {
    flex: 1;
    overflow: auto;
    padding: 10px 12px;
  }

  .empty {
    color: rgba(230, 237, 243, 0.7);
    font-size: 13px;
  }

  .invocation-group {
    margin-bottom: 4px;
    border: 1px solid rgba(88, 166, 255, 0.25);
    border-radius: 6px;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }

  .invocation-group.highlighted {
    border-color: rgba(230, 237, 243, 0.5);
    background-color: rgba(230, 237, 243, 0.05);
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    background: rgba(88, 166, 255, 0.08);
    border: none;
    cursor: pointer;
    text-align: left;
    font: inherit;
    color: #e6edf3;
    transition: background 0.2s;
  }

  .group-header:hover {
    background: rgba(88, 166, 255, 0.15);
  }

  .group-arrow {
    font-size: 10px;
    color: rgba(230, 237, 243, 0.65);
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .group-arrow.expanded {
    transform: rotate(90deg);
  }

  .group-id {
    font-size: 11px;
    font-family: monospace;
    color: rgba(230, 237, 243, 0.8);
    background: rgba(255, 255, 255, 0.08);
    padding: 2px 6px;
    border-radius: 3px;
  }

  .tool-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1;
    cursor: help;
    background: rgba(163, 113, 247, 0.15);
    color: #a371f7;
    border: 1px solid rgba(163, 113, 247, 0.3);
  }

  .group-meta {
    font-size: 11px;
    color: rgba(230, 237, 243, 0.6);
    flex: 1;
  }

  .group-time {
    font-size: 11px;
    color: rgba(230, 237, 243, 0.5);
    font-family: monospace;
  }

  .group-events {
    border-top: 1px solid rgba(88, 166, 255, 0.15);
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.15);
  }
</style>
