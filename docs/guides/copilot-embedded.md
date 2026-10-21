<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Copilot Embedded

The Intershop PWA provides an integration with the Copilot Embedded, an AI agent that recommends products through a chat.

Unlike the [Intershop Copilot for Buyers](./copilot.md) - which embeds a pre-built chat UI - the PWA owns the whole Copilot Embedded UI and all REST interaction with the underlying [Flowise](https://flowiseai.com/) chatflow.

> [!NOTE]
> The Product Advisor is an experimental feature. Its functionality and configuration can change in future releases.

> [!IMPORTANT]
> Before enabling the Product Advisor, review its data flows and applicable privacy requirements for your deployment.
> Inform users about chat data stored in the browser and sent to the configured Flowise chatflow.
> Provide any privacy notice or consent mechanism required for your deployment.

## Configuration

Enable the `copilotEmbedded` feature toggle and provide the Flowise connection details.
The `copilotEmbedded` configuration is required whenever the feature toggle is enabled.

Example via _environment.ts_ file:

```typescript
features: ['copilotEmbedded'],
copilotEmbedded: {
  chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
  apiHost: 'https://<FLOWISE-API-HOST>',
},
```

Example via _docker-compose.yml_ configuration:

```yaml
pwa:
  environment:
    FEATURES: |
      - copilotEmbedded
    COPILOT_EMBEDDED: |
      chatflowid: "xxxx-xxxx-xxxx-xxxx-xxxx"
      apiHost: "https://<FLOWISE-API-HOST>"
```

- `chatflowid` - project specific Flowise chatflow ID.
- `apiHost` - URL to the project specific Flowise API host.

Optionally, the following values can be added to the configuration:

- `streaming` - forces the response mode.
  `true` always streams the answer, `false` always waits for the complete answer.
  If omitted, the PWA checks whether the chatflow supports streaming.
- `chatflowConfig` - additional chatflow variables that are sent with every request, provided as `vars` object.
  They extend the default variables described in [Chatflow Integration](#chatflow-integration) below.

The Copilot Embedded is reachable at `/copilot`.
The header link and the page title use the localization key `copilot.embedded.link`.

> [!NOTE]
> The texts of the chat page, e.g., the starter prompts, are demo content of the Intershop B2B demo shop.
> Adapt the `copilot.embedded.*` localizations to the project's catalog and chatflow.

## Chatflow Integration

The PWA sends the following variables with every request (`overrideConfig.vars`):

- `restEndpoint` - ICM REST endpoint including the current channel context.
- `currentLocale` - current PWA locale, e.g., `en_US`.
- `user_token` - ICM access token of the logged-in user, so the chatflow can call ICM on behalf of the user.
  It is only sent if a user is logged in.

> [!IMPORTANT]
> The ICM tools of the chatflow use their own ICM configuration, which is independent of the PWA.
> Make sure that the PWA and the chatflow use the same ICM host and the same site (channel).
> Otherwise, the chatflow recommends products that the PWA cannot load, and basket actions fail.

Additionally, the PWA appends the current context to each question, because Flowise does not resolve runtime variables inside the prompt:

```text
[CURRENT_BASKET]=[{"sku":"1234","quantity":2}]
[ORDER_TEMPLATES]=[{"id":"abc","title":"My List"}]
[SHOWN_PRODUCTS]=[{"sku":"201807204","title":"Microsoft Surface Laptop"}]
```

The chatflow prompt can use these markers, e.g., to add products to the basket or to an existing order template without calling ICM first.
`[SHOWN_PRODUCTS]` lists the products of the results panel in display order, so the chatflow can resolve references like "add the first one".

Image uploads require a chatflow with image uploads enabled on a vision-capable chat model.

The chat history is stored in the browser's localStorage for 1 day by default, configurable as lifetime in minutes via `dataRetention.copilotEmbedded`.
The **Start a new conversation** button and the logout delete the stored chat history.

## `handleToolCall` Actions

The Copilot Embedded handles the same PWA tool calls as the Intershop Copilot for Buyers, see [`handleToolCall` Actions](./copilot.md#handletoolcall-actions).
The handlers are implemented in the [_copilot-embedded-tool-call.service.ts_](../../src/app/extensions/copilot-embedded/utils/copilot-embedded-tool-call/copilot-embedded-tool-call.service.ts).

Unlike the Intershop Copilot for Buyers, the Copilot Embedded checks the feature toggles that some tool calls depend on.
If a feature is disabled, e.g., order templates in a B2C shop, the tool call is ignored instead of leading to an error page:

- `compare` - required for the `PWA_compare_products` tool.
- `orderTemplates` - required for the `PWA_order_template_actions` tool and for navigating to the order template pages via `PWA_navigate_to_page`.

Additionally, the Copilot Embedded supports the `PWA_ask_choice` tool, which renders predefined answers as clickable choices.
The tool accepts the following input parameters:

- `question` - optional question the choices refer to.
- `options` - pipe-separated list of answers, e.g., `In the office|Hybrid|Mobile`.
- `multiSelect` - if `true`, the user can select multiple options, which are sent as a comma-separated answer.
