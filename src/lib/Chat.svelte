<script lang="ts">
  import TextInput from "./TextInput.svelte";
  import TextArea from "./TextArea.svelte";

  let text: string = $state("");

  function handleSend(prompt: string) {
    fetch("http://localhost:3002/api/agent", {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        return response.json();
      })
      .then((data) => {
        text = data.text;
      })
      .catch((err) => {
        console.error("handleSend error:", err);
        text = `Error: ${err.message}`;
      });
  }
</script>

<div id="chat">
  <TextArea {text} />
  <TextInput onsend={handleSend} />
</div>

<style>
  #chat {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
