<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Sparque AI Integration

Sparque AI works as a search engine and delivers various information, like keyword suggestions, search results, filter options and category navigation.

## Configuration

To use the Sparque search engine, the following steps must be taken into account during deployment:

- store the correct sparque configuration as an environment variable [Sparque Config Model](../../src/app/core/models/sparque/sparque-config.model.ts)

Example for the specification of the sparque configuration in a docker compose file:

```yaml
# PWA container settings
pwa:
  environment:
    SPARQUE: '{"serverUrl": "<sparque connection url>", "wrapperApi": "<wrapper api version>", "WorkspaceName": "<name of the workspace>", "ApiName": "<used sparque api>", "ChannelId": <in sparque workspace configured channel>}'
```

Example for the specification of the sparque configuration in an environment file:

```typescript
sparque: {
  serverUrl: '<sparque connection url>',
  wrapperApi: '<wrapper api version>',
  WorkspaceName: '<name of the workspace>',
  ApiName: '<used sparque api>',
  ChannelId: '<in sparque workspace configured channel>',
},
```

> The specification of the sparque configuration data in the kubernetes deployment file uses the same key/value syntax.
> The value of the SPARQUE key is a string that must be specified in JSON format. See the example above.

## Suggest Components

- [Search Box Component](../../src/app/core/standalone/component/suggest/search-box/search-box.component.ts): This component is responsible for providing autosuggestions for search queries. When a user starts typing in the search box, the component interacts with the Sparque AI search engine to fetch and display relevant keyword suggestions, products, catalogs and brands in real-time. This enhances the user experience by helping users quickly find what they are looking for and reducing the effort required to type full search queries.

  > This component is used for the Solr suggestion too, in case Sparque is not configured.

  The Search Box Component consists of several components that work together to provide a seamless search experience:

  - **[ish-suggest-keywords-tile](../../src/app/core/standalone/component/suggest/suggest-keywords-tile/suggest-keywords-tile.component.ts)**: Displays real-time keyword suggestions.
  - **[ish-suggest-categories-tile](../../src/app/core/standalone/component/suggest/suggest-categories-tile/suggest-categories-tile.component.ts)**: Displays the real-time suggested categories.
  - **[ish-suggest-products-tile](../../src/app/core/standalone/component/suggest/suggest-products-tile/suggest-products-tile.component.ts)**: Shows relevant product suggestions based on the user's input.
  - **[ish-suggest-brands-tile](../../src/app/core/standalone/component/suggest/suggest-brands-tile/suggest-brands-tile.component.ts)**: Provides brand suggestions related to the search terms.
  - **[ish-suggest-search-terms-tile](../../src/app/core/standalone/component/suggest/suggest-search-terms-tile/suggest-search-terms-tile.component.ts)**: Shows the search terms the user has already searched for in the past. The last 10 search terms are stored in the browser's local storage.

  The number of objects to be displayed can be configured individually for each component:

  ```ts
  @Input() maxAutoSuggests: number;
  ```
