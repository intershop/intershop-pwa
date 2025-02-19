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
    container_name: pwa
    image: ${PWA_IMAGE}
    environment:
      ...
      SPARQUE: '{"server_url": "<sparque connection url>", "wrapperAPI": "v2", "workspaceName": <name of the workspace>, "apiName": <used sparque api>, "channelId": <in sparque workspace configured channel>}'
```

> The specification of the sparque configuration data in the kubernetes deployment file uses the same key/value syntax.
> The value of the SPARQUE key is a string that must be specified in JSON format. See the example above.

## Affected Components

- [Search Box Component](../../src/app/core/standalone/component/suggest/search-box/search-box.component.ts): This component is responsible for providing autosuggestions for search queries. When a user starts typing in the search box, the component interacts with the Sparque AI search engine to fetch and display relevant keyword suggestions, products, catalogs and brands in real-time. This enhances the user experience by helping users quickly find what they are looking for and reducing the effort required to type full search queries.
  > This component will also used for the Solr suggestion, in case Sparque is not configured.
