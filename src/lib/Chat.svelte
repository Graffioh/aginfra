<script lang="ts">
  import TextInput from "./TextInput.svelte";
  import TextArea from "./TextArea.svelte";

  type ChatMessage = { role: "user" | "assistant"; content: string };

  let messages: ChatMessage[] = $state([]);
  let chatText = $state("");
  let isSending = $state(false);

  function escapeHtml(input: string) {
    return input.replace(/[&<>"']/g, (ch) => {
      switch (ch) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return ch;
      }
    });
  }

  function updateChatText() {
    chatText = messages
      .map(
        (m) =>
          `<b>${m.role === "user" ? "You" : "Assistant"}:</b> ${escapeHtml(m.content)}`
      )
      .join("\n\n");
  }

  async function handleSend(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || isSending) return;

    messages = [...messages, { role: "user", content: trimmed }];
    updateChatText();
    isSending = true;

    try {
      const response = await fetch("http://localhost:3002/api/agent", {
        method: "POST",
        body: JSON.stringify({ prompt: trimmed }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      messages = [...messages, { role: "assistant", content: data.text }];
      updateChatText();
    } catch (err) {
      console.error("handleSend error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      messages = [
        ...messages,
        { role: "assistant", content: `Error: ${message}` },
      ];
      updateChatText();
    } finally {
      isSending = false;
    }
  }
</script>

<div id="chat">
  <TextArea text={chatText} />
  {#if isSending}
    <div class="status">Thinking...</div>
  {/if}
  <TextInput onsend={handleSend} />
</div>

<style>
  #chat {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status {
    font-size: 16px;
    color: #b0b0b0;
  }
</style>
