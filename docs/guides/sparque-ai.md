<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# SPARQUE.AI

- [Configuration](#configuration)
  - [Multi-Site Configurations](#multi-site-configurations)
  - [Prices](#prices)
  - [Versioning of SPARQUE Service Requests](#versioning-of-sparque-service-requests)
- [Provider Concept](#provider-concept)
- [Suggestion Feature](#suggestion-feature)
  - [New Standalone Components](#new-standalone-components)
  - [Recent Search Terms](#recent-search-terms)
- [Search Feature](#search-feature)

SPARQUE.AI works as an AI-powered search engine and delivers various information, like keyword suggestions, search results, filter options, and category navigation.

## Configuration

To use the SPARQUE search engine, the PWA must be configured accordingly.
The configuration data is described in the [SPARQUE Config Model](../../src/app/core/models/sparque/sparque-config.model.ts) and contains values required for the interaction with the SPARQUE server.
Depending on the PWA setup, you have various options for storing the SPARQUE configuration.
In any case, the names of the configuration parameters must correspond exactly to the names of the parameters in the SPARQUE config model.

> [!NOTE]
> If the SPARQUE configuration is not provided, the Solr search engine is used by default.
> The SPARQUE configuration itself works as a feature toggle to enable the SPARQUE integration.

Example for the specification of the SPARQUE configuration via `environment` file:

```ts
sparque: {
  serverUrl: '<sparque connection url>',
  workspaceName: '<name of the workspace>',
  apiName: '<used sparque api>',
  // config <= optional parameter
  // in case this parameter is empty, the wrapper will use default as fallback
  config: '<sparque REST configuration e.g. production>'
  channelId: '<in sparque workspace configured channel>',
  enablePrices: true | false,
},
```

Example for the specification of the SPARQUE configuration via `docker-compose.yaml` file:

```yaml
# PWA container settings
pwa:
  environment:
    SPARQUE: |
      serverUrl: <sparque connection url>
      workspaceName: <name of the workspace>
      apiName: <used sparque api>
      config: <sparque REST configuration, e.g., production>
      channelId: <channel configured in sparque workspace>
      enablePrices: <true|false>
```

Example for the specification of the SPARQUE configuration via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: SPARQUE
    value: |
      {
        "serverUrl": "<sparque connection url>"
        "workspaceName": "<name of the workspace>"
        "apiName": "<used sparque api>"
        "config": "<sparque REST configuration, e.g., production>"
        "channelId": "<channel configured in sparque workspace>"
        "enablePrices": "<true|false>"
      }
```

### Multi-Site Configurations

The SPARQUE integration also supports dynamic configurations of a single PWA container deployment with regard to a multi-site scenario, see [Guide - Multi-Site Configurations](./multi-site-configurations.md).

Example for the specification of multiple domain configuration in a NGINX Docker yaml:

```yaml
'domain1':
  channel: channel1
  sparque:
    serverUrl: <sparque connection url>
    workspaceName: <name of the workspace>
    apiName: <used sparque api>
    config: <sparque REST configuration e.g. production>
    channelId: <channel configured in sparque workspace>
    enablePrices: true | false
  ...
```

### Prices

The PWA SPARQUE configuration also contains a parameter `enablePrices`.
If this parameter is set to `true`, the product prices provided by SPARQUE will be used.
Otherwise, the product prices are fetched from ICM.
If the ICM prices will be used, the pricing facet provided by SPARQUE may not work properly.

### Versioning of SPARQUE Service Requests

It is possible to specify the request API version to be used for each individual SPARQUE REST call.
To change to another API version, the affected get method API parameter has to be adapted.
If a version other than the recommended PWA version is used, the interfaces and mapper used for the request may have to be adapted.

The following example shows the provided `SparqueSuggestionsService` which uses the v2 API version in the `searchSuggestions` method:

```ts
export class SparqueSuggestionsService implements SuggestionsServiceInterface {
  // API version for Sparque API.
  private readonly apiVersion = 'v2';
  ...
  searchSuggestions(
    searchTerm: string
  ): Observable<{ suggestions: Suggestions; categories?: CategoryTree; products?: Partial<Product>[] }> {
    ...
    return this.sparqueApiService
      .get<SparqueSuggestions>(`suggestions`, this.apiVersion, { params, skipApiErrorHandling: true })
    ...
  }
}
```

## Provider Concept

To exchange services without changing the corresponding effects method, the provider concept was introduced.
The provider contains a `get()` method which returns the proper service instance regarding the predefined criteria.
Each provider is bound to an interface.
The actual service has to implement this interface.
The service must implement the methods defined in the interface.

```ts
// example SuggestionsServiceProvider
@Injectable({ providedIn: 'root' })
export class SuggestionsServiceProvider {
  ...
  get(): SuggestionsServiceInterface {
    ...
    return isSparque ? this.sparqueSuggestionsService : this.suggestService;
  }
}

// example SuggestionsServiceInterface
@Injectable({ providedIn: 'root' })
export interface SuggestionsServiceInterface {
  ...
  searchSuggestions(
    searchTerm: string
  ): Observable<{ suggestions: Suggestions; categories?: CategoryTree; products?: Partial<Product>[] }>;
}


// example SparqueSuggestionsService implementation
@Injectable({ providedIn: 'root' })
export class SparqueSuggestionsService implements SuggestionsServiceInterface {
  ...
  searchSuggestions(
    searchTerm: string
  ): Observable<{ suggestions: Suggestions; categories?: CategoryTree; products?: Partial<Product>[] }> {
    ...
  }
}

// usage in the search.effects.ts effect
suggestSearch$ =
    !SSR &&
    createEffect(() =>
      this.actions$.pipe(
        ofType(suggestSearch),
        mapToPayloadProperty('searchTerm'),
        concatMap(searchTerm =>
          this.suggestionsServiceProvider
            .get()
            .searchSuggestions(searchTerm)
              ....
      )
  ...
);
```

## Suggestion Feature

Beside the keywords, the SPARQUE.AI suggestion response contains further data like suggested products, categories and brands.
The suggestion is part of the [Search Box Component](../../src/app/shared/components/search/search-box/search-box.component.ts).
As soon as the search term has a length of at least 3 characters, a suggestion request is triggered.
If no hits are found for the used search term, the recently used search terms appear.
Otherwise, the search results are displayed.

### New Standalone Components

- _Search Box Component_: This component is responsible for providing auto-suggestions for search queries. When a user starts typing in the search box, the component interacts with the SPARQUE.AI search engine to fetch and display relevant keyword suggestions, products, catalogs, and brands in real-time. This enhances the user experience by helping users to quickly find what they are looking for and reducing the effort required to type full search queries.

  > [!NOTE]
  > This component is used for the Solr suggestion too, in case SPARQUE is not configured.

  The Search Box Component consists of several components that work together to provide a seamless search experience:

  - **[ish-suggest-keywords](../../src/app/shared/components/search/suggest-keywords/suggest-keywords.component.ts)**: Displays real-time keyword suggestions
  - **[ish-suggest-categories](../../src/app/shared/components/search/suggest-categories/suggest-categories.component.ts)**: Displays the real-time suggested categories
  - **[ish-suggest-products](../../src/app/shared/components/search/suggest-products-tile/suggest-products-tile.component.ts)**: Shows relevant product suggestions based on the user's input
  - **[ish-suggest-brands](../../src/app/shared/components/search/suggest-brands/suggest-brands.component.ts)**: Provides brand suggestions related to the search terms
  - **[ish-suggest-search-terms](../../src/app/shared/components/search/suggest-search-terms/suggest-search-terms.component.ts)**: Shows the search terms the user has already searched for in the past.

  The number of objects to be displayed can be configured individually for each component:

  ```ts
  @Input() maxAutoSuggests: number;
  ```

  The default settings are 5 elements for keywords and recent search terms, 3 elements each for categories and brands, and 8 elements for products.

### Recent Search Terms

The recent search terms are words that were used in the past for a search for this shop domain in the currently used browser.
The last 5 search terms are stored in the browser's local storage.
This functionality is independent of SPARQUE, but was implemented as part of the PWA SPARQUE integration.
This functionality is also available for customers who continue to use the ICM/Solr search.
To customize the number of search terms stored in the browser's local storage, modify the `MAX_NUMBER_OF_STORED_SEARCH_TERMS` constant in the [Search reducer](../../src/app/core/store/shopping/search/search.reducer.ts) to suit your requirements.

## Search Feature

The SPARQUE.AI search response not only delivers product results but also includes relevant filters, sorting options, and product pricing.
This eliminates the need for additional requests to gather all the data required for the search page.
As outlined in the [Pricing](#pricing) section, prices are only considered if the PWA SPARQUE configuration parameter `enablePrices` is set to `true`.
Otherwise, an ICM price list request is required to manage prices in the PWA.
The SPARQUE response data is mapped to the existing data models used by the PWA, ensuring that no modifications are needed for the components utilized on the search page.
