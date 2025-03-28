<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# SPARQUE.AI Integration

- [SPARQUE.AI Integration](#sparqueai-integration)
  - [Configuration](#configuration)
    - [Multi-Site Configurations](#multi-site-configurations)
  - [Suggest Components](#suggest-components)

SPARQUE.AI works as an AI-powered search engine and delivers various information, like keyword suggestions, search results, filter options, and category navigation.

## Configuration

To use the SPARQUE search engine, the PWA must be configured accordingly.
The configuration data is described in the [SPARQUE Config Model](../../src/app/core/models/sparque/sparque-config.model.ts) and contains values required for the interaction with the SPARQUE server.
Depending on the PWA setup, you have various options for storing the SPARQUE configuration.
In any case, the name of the configuration parameters must correspond exactly to the names of the parameters in the SPARQUE config model.

> [!NOTE]
> If the SPARQUE configuration data is not stored, the Solr search engine is used by default.

Example for the specification of the SPARQUE configuration in an environment file:

```typescript
sparque: {
  serverUrl: '<sparque connection url>',
  wrapperApi: '<wrapper api version>',
  workspaceName: '<name of the workspace>',
  apiName: '<used sparque api>',
  channelId: '<in sparque workspace configured channel>',
},
```

Example for the specification of the SPARQUE configuration in a Docker compose file:

```yaml
# PWA container settings
pwa:
  environment:
    SPARQUE: '{"serverUrl": "<sparque connection url>", "wrapperApi": "<wrapper api version>", "workspaceName": "<name of the workspace>", "apiName": "<used sparque api>", "channelId": <in sparque workspace configured channel>}'
```

> [!NOTE]
> The specification of the SPARQUE configuration data in the Kubernetes deployment file uses the same key/value syntax.
> The value of the SPARQUE key is a string that must be specified in JSON format. See the example above.

### Multi-Site Configurations

The SPARQUE integration also supports dynamic configurations of a single PWA container deployment in regards of a multi-site scenario. (see [Guide - Multi-Site Configurations](./multi-site-configurations.md))

Example for the specification of multiple domain configuration in a NGINX docker yaml:

```yaml
'domain1':
  channel: channel1
  sparque:
    serverUrl: <sparque connection url>
    wrapperApi: <wrapper api version>
    workspaceName: <name of the workspace>
    apiName: <used sparque api>
    channelId: <in sparque workspace configured channel>
  ...
```

## Suggest Components

- [Search Box Component](../../src/app/core/standalone/component/suggest/search-box/search-box.component.ts): This component is responsible for providing auto-suggestions for search queries. When a user starts typing in the search box, the component interacts with the SPARQUE.AI search engine to fetch and display relevant keyword suggestions, products, catalogs and brands in real-time. This enhances the user experience by helping users quickly find what they are looking for and reducing the effort required to type full search queries.

  > [!NOTE]
  > This component is used for the Solr suggestion too, in case SPARQUE is not configured.

  The Search Box Component consists of several components that work together to provide a seamless search experience:

  - **[ish-suggest-keywords-tile](../../src/app/core/standalone/component/suggest/suggest-keywords-tile/suggest-keywords-tile.component.ts)**: Displays real-time keyword suggestions
  - **[ish-suggest-categories-tile](../../src/app/core/standalone/component/suggest/suggest-categories-tile/suggest-categories-tile.component.ts)**: Displays the real-time suggested categories
  - **[ish-suggest-products-tile](../../src/app/core/standalone/component/suggest/suggest-products-tile/suggest-products-tile.component.ts)**: Shows relevant product suggestions based on the user's input
  - **[ish-suggest-brands-tile](../../src/app/core/standalone/component/suggest/suggest-brands-tile/suggest-brands-tile.component.ts)**: Provides brand suggestions related to the search terms
  - **[ish-suggest-search-terms-tile](../../src/app/core/standalone/component/suggest/suggest-search-terms-tile/suggest-search-terms-tile.component.ts)**: Shows the search terms the user has already searched for in the past. The last 10 search terms are stored in the browser's local storage.

  The number of objects to be displayed can be configured individually for each component:

  ```ts
  @Input() maxAutoSuggests: number;
  ```

  The default settings are 5 elements for keywords and recent search terms, 3 elements each for categories and brands and 8 elements for products.
