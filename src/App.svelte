<script lang="ts">
  import InspectionPanel from "./lib/InspectionPanel.svelte";
  import JudgePanel from "./lib/JudgePanel.svelte";
  import { evaluationManager } from "./managers/evaluation.svelte";

  let chatWindow: Window | null = null;
  let judgeOpen = $state(false);
  let resultSeen = $state(false);
  const evalState = $derived(evaluationManager.state);
  const showEvalNotification = $derived(!judgeOpen && evalState.result !== null && !resultSeen);

  $effect(() => {
    if (evalState.result === null) {
      resultSeen = false;
    }
  });

  function openChatPopup() {
    if (chatWindow && !chatWindow.closed) {
      chatWindow.focus();
      return;
    }

    chatWindow = window.open(
      "/chat.html",
      "maid-chat",
      "width=600,height=700,resizable=yes,scrollbars=yes"
    );
  }

  function toggleJudge() {
    judgeOpen = !judgeOpen;
    if (judgeOpen && evalState.result !== null) {
      resultSeen = true;
    }
  }
</script>

<main>
  <div id="panels">
    <div id="panel-inspection">
      <InspectionPanel onOpenChat={openChatPopup} />
    </div>
    <button
      class="judge-toggle"
      onclick={toggleJudge}
      aria-label={judgeOpen ? "Collapse judge panel" : "Expand judge panel"}
      aria-expanded={judgeOpen}
    >
      {#if showEvalNotification}
        <span class="eval-pill" title="Evaluation complete. Click to view results.">Result ready</span>
      {/if}
      <span class="arrow {judgeOpen ? '' : 'collapsed'}">▶</span>
    </button>
    <div id="panel-judge" class={judgeOpen ? "" : "collapsed"}>
      <div id="judge-content" class={judgeOpen ? "" : "hidden"}>
        <JudgePanel />
      </div>
    </div>
  </div>
</main>

<style>
  main {
    height: 100%;
  }

  #panels {
    display: flex;
    flex-direction: row;
    gap: 0;
    width: 100%;
    height: 100%;
    align-items: stretch;
    background: black;
  }

  #panel-inspection {
    flex: 1;
    min-width: 0;
  }

  #panel-judge {
    width: 350px;
    transition: width 0.3s ease;
    flex-shrink: 0;
    background: rgb(15, 15, 15);
  }

  #panel-judge.collapsed {
    width: 0;
    overflow: hidden;
  }

  #judge-content {
    height: 100%;
    overflow: hidden;
  }

  #judge-content.hidden {
    display: none;
  }

  .judge-toggle {
    background: rgb(0, 0, 0);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-top: 0;
    border-bottom: 0;
    border-radius: 0;
    color: rgba(230, 237, 243, 0.65);
    cursor: pointer;
    padding: 8px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    flex-shrink: 0;
    width: 30px;
    height: 100%;
    z-index: 10;
  }

  .judge-toggle:hover {
    background: rgba(45, 45, 45, 0.892);
    color: #e6edf3;
  }

  .judge-toggle:active {
    background: rgba(0, 0, 0, 0.15);
  }

  .arrow {
    font-size: 12px;
    transition: transform 0.3s ease;
    display: inline-block;
  }

  .arrow.collapsed {
    transform: rotate(180deg);
  }

  .eval-pill {
    font-size: 9px;
    padding: 4px 2px;
    border-radius: 4px;
    border: 1px solid rgba(126, 231, 135, 0.7);
    color: #7ee787;
    background: rgba(126, 231, 135, 0.15);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: nowrap;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  :global(*:focus) {
    outline: none;
  }
</style>
