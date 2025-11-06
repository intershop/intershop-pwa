<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# SPARQUE.AI

- [Configuration](#configuration)
  - [Configuration Parameters Explained](#configuration-parameters-explained)
  - [Multi-Site Configurations](#multi-site-configurations)
  - [Versioning of SPARQUE Service Requests](#versioning-of-sparque-service-requests)
  - [Feature Toggle Behavior](#feature-toggle-behavior)
    - [Available Feature Toggles](#available-feature-toggles)
  - [Personalization of SPARQUE Requests](#personalization-of-sparque-requests)
- [Provider Concept](#provider-concept)
- [Search Suggestions Feature](#search-suggestions-feature)
  - [Search Box Component](#search-box-component)
  - [Recent Search Terms](#recent-search-terms)
- [Search Feature](#search-feature)
- [Product Recommendations Feature](#product-recommendations-feature)

SPARQUE.AI works as an AI-powered search engine and delivers various types of information, such as keyword suggestions, search results, filter options, and category navigation.

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
  config: '<optional parameter => default>',
  channelId: '<in sparque workspace configured channel>',
  features: ['search', 'suggestions', 'recommendations'],
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
      config: <optional parameter => default>
      channelId: <channel configured in sparque workspace>
      features: ['search', 'suggestions', 'recommendations']
```

Example for the specification of the SPARQUE configuration via [PWA Helm Chart](https://github.com/intershop/helm-charts/tree/main/charts/pwa):

```yaml
environment:
  - name: SPARQUE
    value: |
      {
        "serverUrl": "<sparque connection url>",
        "workspaceName": "<name of the workspace>",
        "apiName": "<used sparque api>",
        "config": "<optional parameter => default>",
        "channelId": "<channel configured in sparque workspace>"
        "features": "['search', 'suggestions', 'recommendations']"
      }
```

### Configuration Parameters Explained

- **serverUrl**: The URL of the SPARQUE server that the PWA will connect to.
  - PROD: https://api.search.sparque.ai
  - Early adopters can use our UAT: https://uat.api.search.sparque.ai (New API releases are available here approximately one week earlier.)
- **workspaceName**: The name of the workspace configured in SPARQUE Desk.
- **apiName**: The name of the API to be used for SPARQUE requests. If your project is based on the ISH project template, use `PWA`. Otherwise, use the name defined in SPARQUE Desk.
- **config**: Optional parameter specifying the SPARQUE REST configuration (defaults to `default` if not provided).
  - Default: `default` (typically used for UAT)
  - Other option: `production` (used for PROD)
  - Additional configurations can be created in the project as needed.
- **channelId**: The channel ID configured in the SPARQUE workspace. The default is `ish`. Adjust this to match your own channelId in your data mapping.
- **features**: Array of feature names to enable selective SPARQUE functionality. Only specified features will be active. Available values: `search`, `suggestions`, `recommendations`.

### Multi-Site Configurations

The SPARQUE integration also supports dynamic configurations of a single PWA container deployment with regard to a multi-site scenario, see [Guide - Multi-Site Configurations](./multi-site-configurations.md).

Example for the specification of multiple domain configuration in an NGINX Docker yaml:

```yaml
'domain1':
  channel: channel1
  sparque:
    serverUrl: <sparque connection url>
    workspaceName: <name of the workspace>
    apiName: <used sparque api>
    config: <sparque REST configuration e.g. production>
    channelId: <channel configured in sparque workspace>
    features: ['search', 'suggestions', 'recommendations']
  ...
```

### Versioning of SPARQUE Service Requests

It is possible to specify the request API version to be used for each individual SPARQUE REST call.
To change to another API version, the affected get method API parameter has to be adapted.
If a version other than the recommended PWA version is used, the interfaces and mapper used for the request may have to be adapted.

The following example shows the provided `SparqueSuggestionsService` which uses the v2 API version in the `searchSuggestions` method:

```ts
export class SparqueSuggestionsService implements SuggestionsServiceInterface {
  // API version for SPARQUE API.
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

### Feature Toggle Behavior

The SPARQUE integration supports selective enabling of features via feature toggles defined in the `features` array of the SPARQUE configuration.
This allows for granular control over which SPARQUE functionalities are active within the PWA.
The feature toggles must be specified in the configuration.
Otherwise, no SPARQUE functions will be executed.

#### Available Feature Toggles

The following feature toggles control SPARQUE functionality:

- **`search`**: Enables SPARQUE-powered product search and filtering
- **`suggestions`**: Enables SPARQUE-powered search suggestions
- **`recommendations`**: Enables SPARQUE-powered product recommendations

> [!IMPORTANT]
> SPARQUE services will only be used when valid SPARQUE configuration is provided. The service providers check for both configuration presence and feature states. Missing configuration will cause the system to fall back to standard ICM services where available, or return `undefined` for recommendations.

### Personalization of SPARQUE Requests

When a user is logged in, each SPARQUE request contains an additional HTTP query parameter with `user` as the key and the user's customerNo/BusinessPartnerNo as the value (this value corresponds to the user ID in orders of an ICM order export).
The request also contains the ICM user token.
This parameter is passed to SPARQUE by the Wrapper and can be used in SPARQUE for the strategies.

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
  get(): Observable<SuggestionsServiceInterface> {
    return this.store.pipe(
      select(getSparqueConfig),
      take(1),
      map(sparqueConfig => (sparqueConfig ? this.sparqueSuggestionsService : this.suggestService))
    );
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
          this.suggestionsServiceProvider.get().pipe(
            concatMap(service =>
              service.searchSuggestions(searchTerm)
              ....
      )
  ...
);
```

## Search Suggestions Feature

In addition to the keywords, the SPARQUE.AI suggestion response contains further data like suggested products, categories, and brands.
The suggestion is part of the [Search Box Component](../../src/app/shared/components/search/search-box/search-box.component.ts).
Once the search term reaches a length of at least 3 characters, a suggestion request is triggered.
If no hits are found for the used search term, the recently used search terms appear.
Otherwise, the search results are displayed.

### Search Box Component

This component is responsible for providing auto-suggestions for search queries.
When a user starts typing in the search box, the component interacts with the SPARQUE.AI search engine to fetch and display relevant keyword suggestions, products, catalogs, and brands in real-time.
This enhances the user experience by helping users to quickly find what they are looking for and reducing the effort required to type full search queries.

> [!NOTE]
> This component is used for the Solr suggestion too, in case SPARQUE is not configured.

The Search Box Component consists of several components that work together to provide a seamless search experience:

- **[ish-suggest-keywords](../../src/app/shared/components/search/suggest-keywords/suggest-keywords.component.ts)**: Displays real-time keyword suggestions
- **[ish-suggest-categories](../../src/app/shared/components/search/suggest-categories/suggest-categories.component.ts)**: Displays the real-time suggested categories
- **[ish-suggest-products](../../src/app/shared/components/search/suggest-products-tile/suggest-products-tile.component.ts)**: Shows relevant product suggestions based on the user's input
- **[ish-suggest-brands](../../src/app/shared/components/search/suggest-brands/suggest-brands.component.ts)**: Provides brand suggestions related to the search terms
- **[ish-suggest-search-terms](../../src/app/shared/components/search/suggest-search-terms/suggest-search-terms.component.ts)**: Shows the search terms the user has already searched for in the past.

> [!NOTE]
> A brand search will search for the selected brand and set the brand filter.

The number of objects to be displayed can be configured individually for each component:

```ts
@Input() maxAutoSuggests: number;
```

The default settings are 5 elements for keywords and recent search terms, 3 elements each for categories and brands, and 8 elements for products.

### Recent Search Terms

The recent search terms are words that were used in the past for a search for this shop domain in the currently used browser.
The last five search terms are stored in the browser's local storage.
This functionality is independent of SPARQUE, but was implemented as part of the PWA SPARQUE integration.
This functionality is also available for customers who continue to use the ICM/Solr search.
To customize the number of search terms stored in the browser's local storage, modify the `MAX_NUMBER_OF_STORED_SEARCH_TERMS` constant in the [Search reducer](../../src/app/core/store/shopping/search/search.reducer.ts) to suit your requirements.

## Search Feature

The SPARQUE.AI search response not only delivers product results but also includes relevant filters and sorting options.
This eliminates the need for additional requests to gather all the data required for the search page.
The SPARQUE response data is mapped to the existing data models used by the PWA, ensuring that no modifications are needed for the components utilized on the search page.

## Product Recommendations Feature

SPARQUE.AI provides AI-powered product recommendations that you can display throughout the PWA to enhance user experience and increase engagement.
The implementation in the PWA is developed with the help of the [CMS](../concepts/cms-integration.md).
This allows for a high degree of flexibility in terms of where and how recommendations are displayed in the application.
The CMS component to be used in ICM is called _Product List (SPARQUE Recommendations)_ with the qualified name `app_sf_base_cm:component.common.productListRecommendations.pagelet2-Component`.

```ts
// CMS Module
...
{
provide: CMS_COMPONENT,
useValue: {
definitionQualifiedName: 'app_sf_base_cm:component.common.productListRecommendations.pagelet2-Component',
class: CMSProductListRecommendationsComponent,
},
multi: true,
},...

`
```
