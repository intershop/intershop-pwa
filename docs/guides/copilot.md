<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Intershop Copilot for Buyers

The Intershop PWA provides an integration with Intershop Copilot for Buyers.

Official Intershop Documentation: [Intershop Copilot - AI Purchase and Service Assistant](https://knowledge.intershop.com/kb/index.php/Display/31N345)

The Intershop Copilot system consists of:

- **PWA extension** - logic to connect with the Copilot backend service and execute the `copilotUIFile`
- **Copilot UI file** - `web.js` file that contains the popup
- **Copilot backend service** - low-code tool that hosts the chatflow with additional services and connections

The Intershop Copilot embedded chatbot implementation is available in its dedicated [GitHub repository](https://github.com/intershop/ai-flowise-chat-embed).
It is a customized fork of [FlowiseChatEmbed](https://github.com/FlowiseAI/FlowiseChatEmbed).

## Configuration

For the integration of the Intershop Copilot for Buyers, the feature toggle `copilot` needs to be enabled in the PWA configuration.
Additionally, a project- or deployment-specific configuration is needed that provides the following values:

- `copilotUIFile` - URL to the Javascript file that contains the compiled version of the Intershop Copilot embedded chatbot
- `chatflowid` - project-specific ID
- `apiHost`- URL to the specific Flowise REST API

Example via `environment.ts` file:

```typescript
features: ['copilot'],
copilot: {
  copilotUIFile: 'https://cdn.jsdelivr.net/gh/intershop/ai-flowise-chat-embed@website/demo-store/dist/web.js',
  chatflowid: '431cecbc-47fe-4e20-b37e-b4ba0ceedff9',
  apiHost: 'https://ish-flowise-app.azurewebsites.net',
},
```

Example via `docker-compose.yml` configuration:

```yaml
pwa:
  environment:
    FEATURES: |
      - copilot
    COPILOT: |
      copilotUIFile: "https://cdn.jsdelivr.net/gh/intershop/ai-flowise-chat-embed@website/demo-store/dist/web.js"
      chatflowid: "431cecbc-47fe-4e20-b37e-b4ba0ceedff9"
      apiHost: "https://ish-flowise-app.azurewebsites.net"
```

Example via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: FEATURES
    value: copilot
  - name: COPILOT
    value: |
      {
        "copilotUIFile": "https://cdn.jsdelivr.net/gh/intershop/ai-flowise-chat-embed@website/demo-store/dist/web.js",
        "chatflowid": "431cecbc-47fe-4e20-b37e-b4ba0ceedff9",
        "apiHost": "https://ish-flowise-app.azurewebsites.net"
      }
```

## Additional `chatflowConfig` Variables

Additional `chatflowConfig` variables can be provided via deployment configuration as well if needed and will be handled by the chatbot implementation.
These variables extend the currently provided defaults (`restEndpoint`, `currentLocale`).

Example via `docker-compose.yml` configuration:

```yaml
pwa:
  environment:
    COPILOT: |
      ...
      chatflowConfig: { "vars": { "foo": "bar", "hello": "world" } }
```

Example via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: COPILOT
    value: |
      {
        ...
        "chatflowConfig": { "vars": { "foo": "bar", "hello": "world" } }
      }
```

## Customize Chatbot

Besides the mandatory configuration, you can also use additional chatbot theme configuration provided through deployment configuration that overwrites the current default configuration from the [`copilot.component.ts`](../../src/app/extensions/copilot/shared/copilot/copilot.component.ts).
The available options can be found in the appropriate version of the [chatbot implementation](https://github.com/intershop/ai-flowise-chat-embed?tab=readme-ov-file#configuration).

Example via `docker-compose.yml` configuration:

```yaml
pwa:
  environment:
    COPILOT: |
      ...
      theme: { "chatWindow": { "title": "Assistant Title" }, "button": { "backgroundColor": "purple", "size": 60 }, "tooltip": { "showTooltip": true } }
```

Example via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: COPILOT
    value: |
      {
        ...
        "theme": { "chatWindow": { "title": "Assistant Title" }, "button": { "backgroundColor": "purple", "size": 60 }, "tooltip": { "showTooltip": true } }
      }
```

## Override Chatbot Styling

The chatbot theme configuration provides an option to override the default styling via `customCSS` in the `copilot.component.ts`.

```typescript
// Add custom CSS styles.
Use !important to override default styles
customCSS: `
  .chatbot-container {
    font-family: 'robotoregular' !important;
  }
  input, textarea {
    font-family: 'robotoregular' !important;
  }
`,
```

## `handleToolCall` Actions

Tool calls like `openBasket` are triggered by the Copilot backend service and can be detected in the PWA.
The `handleToolCall` method handles these actions and the parameters given by the Intershop Copilot for Buyers.
A new method in the Copilot backend service that is meant to control something inside the PWA needs a new handler in this function.

The handler currently checks only the last tool call.
So, for example, the user asked for a laptop, and the Intershop Copilot for Buyers first runs the `search` and then the `openProduct` tool.
In that case, only the `openProduct` tool is handled.

Refer to the `handleToolCall` method of the [`copilot.component.ts`](../../src/app/extensions/copilot/shared/copilot/copilot.component.ts) and ensure that any functionalities that depend on certain feature toggles are enabled in the PWA configuration as well, e.g., `compare` in the current implementation.
