import { UCP_BASE_PATH, UCP_VERSION } from '../config';

/**
 * Builds the public UCP business profile served at `/.well-known/ucp`.
 *
 * The profile declares which UCP capabilities this business supports, the spec
 * versions, the transport, and the endpoint base URL agents should call.
 * Structure follows the UCP profile guide (https://ucp.dev).
 *
 * Scope: non-transactional catalog discovery only. This business advertises the
 * Catalog Search and Lookup capabilities over the existing REST API. Cart,
 * checkout, payment and order capabilities are deliberately not declared.
 *
 * @param origin absolute origin of this deployment (e.g. `https://ucp.example.com`)
 * @param options catalog localization advertised to agents (locales/currencies they may request)
 */
export function buildUcpProfile(
  origin: string,
  options?: { supportedLocales?: string[]; supportedCurrencies?: string[] }
): Record<string, unknown> {
  const endpoint = `${origin}${UCP_BASE_PATH}`;
  const specBase = `https://ucp.dev/${UCP_VERSION}`;
  const supportedLocales = options?.supportedLocales?.length ? options.supportedLocales : undefined;
  const supportedCurrencies = options?.supportedCurrencies?.length ? options.supportedCurrencies : undefined;

  return {
    ucp: {
      version: UCP_VERSION,
      services: {
        'dev.ucp.shopping': [
          {
            version: UCP_VERSION,
            spec: `${specBase}/specification/overview`,
            transport: 'rest',
            endpoint,
            // Business-profile REST service schema: our own OpenAPI describing the catalog surface.
            schema: `${endpoint}/openapi.json`,
            // Locales/currencies an agent may request via Accept-Language / Accept-Currency.
            ...(supportedLocales ? { supported_locales: supportedLocales } : {}),
            ...(supportedCurrencies ? { supported_currencies: supportedCurrencies } : {}),
          },
        ],
      },
      capabilities: {
        'dev.ucp.shopping.catalog.search': [
          {
            version: UCP_VERSION,
            spec: `${specBase}/specification/catalog/search`,
            schema: `${specBase}/schemas/shopping/catalog_search.json`,
          },
        ],
        'dev.ucp.shopping.catalog.lookup': [
          {
            version: UCP_VERSION,
            spec: `${specBase}/specification/catalog/lookup`,
            schema: `${specBase}/schemas/shopping/catalog_lookup.json`,
          },
        ],
      },
    },
  };
}
