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
  They extend the default variables described in [Chatflow Integration](#chatflow-integration).

The Copilot Embedded is reachable at `/copilot`.
If the feature toggle is enabled, the header shows a link to this page.
The link text and the page title use the localization key `copilot.embedded.link`, so a project can rename the feature by changing this translation.

## Chatflow Integration

The PWA sends the following variables with every request (`overrideConfig.vars`):

- `restEndpoint` - ICM REST endpoint including the current channel context.
- `currentLocale` - current PWA locale, e.g., `en_US`.
- `user_token` - ICM access token of the logged-in user, so the chatflow can call ICM on behalf of the user.
  It is only sent if a user is logged in.

Additionally, the PWA appends the current context to each question, because Flowise does not resolve runtime variables inside the prompt:

```text
[CURRENT_BASKET]=[{"sku":"1234","quantity":2}]
[ORDER_TEMPLATES]=[{"id":"abc","title":"My List"}]
```

The chatflow prompt can use these markers, e.g., to add products to the basket or to an existing order template without calling ICM first.
If the `orderTemplates` feature toggle is disabled, `[ORDER_TEMPLATES]` is always an empty list.

## Image Upload

Users can attach an image (JPEG, PNG, GIF, or WebP, up to 5 MB) to a question.
This requires a chatflow with image uploads enabled on a vision-capable chat model.

## Chat History

The chat history is stored in the browser's localStorage, so a conversation survives a page reload:

- `copilot_embedded_chat_<chatflowid>` - transcript, including image thumbnails and the Flowise `chatId`.
- `copilot_embedded_session_id` - session ID that links the conversation to the chatflow memory.

The _Start a new conversation_ button clears the transcript and creates a new session ID, so the chatflow starts without memory of the previous conversation.

## `handleToolCall` Actions

The Copilot Embedded handles the same PWA tool calls as the Intershop Copilot for Buyers, see [`handleToolCall` Actions](./copilot.md#handletoolcall-actions).
The handlers are implemented in the [_copilot-embedded-tool-call.facade.ts_](../../src/app/extensions/copilot-embedded/facades/copilot-embedded-tool-call.facade.ts).

Unlike the Intershop Copilot for Buyers, the Copilot Embedded checks the feature toggles that some tool calls depend on.
If a feature is disabled, e.g., order templates in a B2C shop, the tool call is ignored instead of leading to an error page:

- `compare` - required for the `PWA_compare_products` tool.
- `orderTemplates` - required for the `PWA_order_template_actions` tool and for navigating to the order template pages via `PWA_navigate_to_page`.

Additionally, the Copilot Embedded supports the `PWA_ask_choice` tool.
It renders predefined answers as clickable choice chips below the bot message, so the user can select an answer instead of typing it.
The tool accepts the following input parameters:

- `question` - optional question the choices refer to.
- `options` - pipe-separated list of answers, e.g., `In the office|Hybrid|Mobile`.
- `multiSelect` - if `true`, the user can select multiple chips and confirm them. The selected options are sent as a comma-separated answer.
  Otherwise, a click on a chip sends the answer immediately.

The chips are only shown for the latest bot message.
