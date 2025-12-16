<script lang="ts">
  import Chat from './lib/Chat.svelte'
  import AgentInspection from './lib/AgentInspection.svelte'
</script>

<main>
  <div id="panels">
    <div id="panel1">
      <AgentInspection />
    </div>
    <div id="panel2">
      <Chat />
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
    gap: 10px;
    width: 100%;
    height: 100%;
  }

  #panel1 {
    width: 50%;
  }

  #panel2 {
    width: 50%;
  }
</style>
