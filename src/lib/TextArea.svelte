<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<div class="chat-display">{@html text}</div>

<style>
  .chat-display {
    height: 80%;
    resize: none;
    font-size: 16px;
    font-family: inherit;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    white-space: pre-wrap;
    overflow-y: auto;
  }
</style>
