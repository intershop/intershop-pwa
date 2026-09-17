<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Product Advisor

The Intershop PWA provides an integration with the Product Advisor, an AI agent that recommends products through a chat.

Unlike the [Intershop Copilot for Buyers](./copilot.md) - which embeds a pre-built chat UI - the PWA owns the whole Product Advisor UI and all REST interaction with the underlying [Flowise](https://flowiseai.com/) chatflow.

> This guide is intentionally minimal and will be expanded.

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

## Architecture

The integration lives in `src/app/extensions/product-advisor`.

- `ProductAdvisorService` - talks to the Flowise Prediction API (`POST {apiHost}/api/v1/prediction/{chatflowid}`), supporting a non-streaming request and a streaming request via Server-Sent Events.
- `ProductAdvisorFacade` - the single injection point for components.
- The service forwards the current `restEndpoint`, `currentLocale`, and the logged-in user's ICM `user_token` as chatflow variables.

The current REST endpoint is reachable at `/product-advisor` via an interim page that is meant to be replaced by the final UI.
