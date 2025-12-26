# maid Svelte frontend package

Svelte frontend.

### Connection status indicators

The UI displays different connection statuses:

- **Connecting...** - The frontend is establishing connection to the inspection server
- **Live** - The frontend is connected to the inspection server AND an agent is actively sending events (activity detected within the last 10 seconds)
- **Idle** - The frontend is connected to the inspection server but no agent is currently sending events
- **Error** - The frontend failed to connect to the inspection server

The agent is considered "connected" if it has sent any inspection event (trace, context, tokens, tools, model) within the last 10 seconds. This allows you to see at a glance whether your agent is running.
