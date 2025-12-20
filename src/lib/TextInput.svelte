<script lang="ts">
  let message = $state("");
  let { onsend, disabled = false } = $props<{
    onsend: (message: string) => void;
    disabled?: boolean;
  }>();
</script>

<div class="input-container">
  <textarea
    placeholder="Chat with the agent..."
    bind:value={message}
    {disabled}
    onkeypress={(e) => {
      if (e.key === "Enter" && !e.shiftKey && !disabled) {
        onsend(message);
        message = "";
        e.preventDefault();
      }
    }}
  ></textarea>

  <button
    {disabled}
    onclick={() => {
      if (!disabled) {
        onsend(message);
        message = "";
      }
    }}
  >
    Send</button
  >
</div>

<style>
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  textarea {
    height: 80px;
    resize: none;
    font-family: inherit;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #e6edf3;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  textarea:focus {
    outline: none;
    border-color: rgba(88, 166, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }

  textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button {
    align-self: flex-end;
    padding: 6px 16px;
    background: #fbce51;
    color: #000000;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: #ffe046ca;
  }

  button:disabled {
    background: #fbce5180;
    color: #00000080;
    cursor: not-allowed;
  }
</style>
