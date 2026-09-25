<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Copilot Embedded

The Intershop PWA provides an integration with the Copilot Embedded, an AI agent that recommends products through a chat.

Unlike the [Intershop Copilot for Buyers](./copilot.md) - which embeds a pre-built chat UI - the PWA owns the whole Copilot Embedded UI and all REST interaction with the underlying [Flowise](https://flowiseai.com/) chatflow.

## Configuration

Enable the `copilotEmbedded` feature toggle and provide the Flowise connection details.

Example via `environment.ts` file:

```typescript
features: ['copilotEmbedded'],
copilotEmbedded: {
  chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
  apiHost: 'https://<FLOWISE-API-HOST>',
},
```

- `chatflowid` - project specific Flowise chatflow ID.
- `apiHost` - URL to the project specific Flowise API host.

The Copilot Embedded is reachable at `/copilot`.
