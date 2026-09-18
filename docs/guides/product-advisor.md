<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Product Advisor

The Intershop PWA provides an integration with the Product Advisor, an AI agent that recommends products through a chat.

Unlike the [Intershop Copilot for Buyers](./copilot.md) - which embeds a pre-built chat UI - the PWA owns the whole Product Advisor UI and all REST interaction with the underlying [Flowise](https://flowiseai.com/) chatflow.

## Configuration

Enable the `productAdvisor` feature toggle and provide the Flowise connection details.

Example via `environment.ts` file:

```typescript
features: ['productAdvisor'],
productAdvisor: {
  chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
  apiHost: 'https://<FLOWISE-API-HOST>',
},
```

- `chatflowid` - project specific Flowise chatflow ID.
- `apiHost` - URL to the project specific Flowise API host.

The advisor is reachable at `/product-advisor`.
