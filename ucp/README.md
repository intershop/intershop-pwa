# Intershop UCP Service

A standalone [UCP](https://ucp.dev/) (Universal Commerce Protocol) service that exposes
non-transactional catalog **Search** and **Lookup** capabilities over the Intershop ICM
REST API, so AI shopping and procurement agents can discover and query the catalog in a
machine-readable way.

It is deployed as its own container, independent of the PWA storefront.

## Scope

Included:

- A machine-readable UCP profile under `/.well-known/ucp`.
- Declaration of the catalog Search (`dev.ucp.shopping.catalog.search`) and Lookup
  (`dev.ucp.shopping.catalog.lookup`) capabilities.
- OpenAPI documentation for the declared capabilities.
- UCP-conformant Search and Lookup endpoints backed by the ICM product REST API.

Excluded (intentionally, non-transactional MVP):

- All transactional flows (cart, checkout, payment, order placement, order management).
- Any capability that requires authentication, signing, authorization, idempotency, or
  payment guarantees.

## Endpoints

| Method | Path                      | Description                                                                     |
| ------ | ------------------------- | ------------------------------------------------------------------------------- |
| `GET`  | `/health`                 | Liveness/readiness probe.                                                       |
| `GET`  | `/.well-known/ucp`        | The public, machine-readable business profile.                                  |
| `GET`  | `/ucp/v1/openapi.json`    | OpenAPI documentation for Search and Lookup.                                    |
| `POST` | `/ucp/v1/catalog/search`  | UCP-conformant catalog Search (free-text).                                      |
| `POST` | `/ucp/v1/catalog/lookup`  | UCP-conformant catalog Lookup (batch by identifier; correlated variant per id). |
| `POST` | `/ucp/v1/catalog/product` | Full product detail (all variants, options, `selected`).                        |
| `GET`  | `/ucp/playground`         | Interactive agent playground (chat + inline conformance).                       |
| `GET`  | `/ucp/validator`          | Interactive spec/schema conformance validator.                                  |

Product prices are returned as integer minor units (for example cents) together with an
ISO 4217 currency code, as required by the UCP catalog model.

## Pricing

Every product carries a `price_range` (`min`/`max`) and each variant a single `price`, both
in integer minor units + ISO 4217 currency. The service maps the ICM product kinds as follows:

- **Simple product** — `price_range.min == max`; one variant at that price.
- **Variation master** — `price_range` spans the cheapest and most expensive variation
  (`minSalePrice`/`maxSalePrice`); the featured variant is the ICM default variation, whose
  own `price` need not equal `price_range.min` (per the UCP spec, the range and the featured
  price are decoupled).
- **Retail set** — `price_range` spans the cheapest part (`minSalePrice`) and the summed
  total (`summedUpSalePrice`); the variant price is the whole-set total.
- **Product bundle** — sold as one unit at a single price, so it maps like a simple product
  (`price_range.min == max`), unlike a retail set.

A strike-through `list_price` / `list_price_range` is emitted only when the list price is
higher than the sale price.

## Configuration

Configuration is read from environment variables (see [.env.example](./.env.example)).

| Variable              | Default                            | Description                                                                                                                                                                                             |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UCP_PORT`            | `4000`                             | Port the service listens on.                                                                                                                                                                            |
| `UCP_PUBLIC_BASE_URL` | request origin                     | Optional fixed public origin of the UCP service, advertised inside the `/.well-known/ucp` profile. If unset, the incoming request origin is used.                                                       |
| `STOREFRONT_BASE_URL` | request origin                     | Storefront origin used to build `/prd<sku>` product page URLs. Include a locale segment (e.g. `https://shop.example.com/en`) to link straight to the localized page and skip the storefront's redirect. |
| `ICM_BASE_URL`        | `https://develop.icm.intershop.de` | Base URL of the ICM backend.                                                                                                                                                                            |
| `ICM_SERVER`          | `INTERSHOP/rest/WFS`               | ICM REST server path.                                                                                                                                                                                   |
| `ICM_CHANNEL`         | `inSPIRED-inTRONICS_Business-Site` | ICM channel the catalog is served from.                                                                                                                                                                 |
| `ICM_APPLICATION`     | `-`                                | ICM application.                                                                                                                                                                                        |
| `ICM_LOCALE`          | `en_US`                            | Locale used for catalog requests.                                                                                                                                                                       |
| `ICM_CURRENCY`        | `USD`                              | Currency used for catalog prices.                                                                                                                                                                       |

## Development

```bash
cd ucp
npm install
npm run serve       # tsx watch on http://localhost:4000
npm run typecheck   # type-check without emitting
npm test            # unit tests (Node built-in test runner)
```

## Production

```bash
npm run build       # compile src -> dist
npm start           # node dist/server.js
```

Or build and run the container:

```bash
docker compose up --build
```

## Running Behind the PWA nginx

The service can also run alongside the storefront and be reached through the storefront
domain. The root `docker-compose.yml` defines a `ucp` service, and the PWA nginx routes
`/.well-known/ucp` and `/ucp/` to it when the `UPSTREAM_UCP` environment variable is set
(for example `UPSTREAM_UCP: 'http://ucp:4000'`).

```powershell
# from the repository root
docker compose up --build
Invoke-RestMethod http://localhost:4200/.well-known/ucp | ConvertTo-Json -Depth 6
```

Because the requests arrive through nginx, the profile `endpoint` and product page URLs are derived from the storefront origin automatically; `UCP_PUBLIC_BASE_URL` and
`STOREFRONT_BASE_URL` only need to be set to override that behavior.

### Caching

When nginx caching is enabled (`CACHE` set to `on`/`true`/`1`/`yes`), the PWA nginx caches
the two **static discovery documents** in a dedicated cache zone to shield the service from
discovery-poll traffic:

| Path                   | Cached? | TTL                           |
| ---------------------- | ------- | ----------------------------- |
| `/.well-known/ucp`     | yes     | `CACHE_DURATION_UCP` (`12h`)  |
| `/ucp/v1/openapi.json` | yes     | `CACHE_DURATION_UCP` (`12h`)  |
| `/ucp/v1/catalog/*`    | no      | always proxied to the service |

The catalog `search`/`lookup`/`product` endpoints are dynamic and body-dependent, so they
are never cached. The TTL is controlled by the `CACHE_DURATION_UCP` environment variable
(default `12h`, set in [nginx/Dockerfile](../nginx/Dockerfile)). nginx deliberately ignores
the upstream `Cache-Control` header and applies its own TTL, so the service's own
`Cache-Control: public, max-age=300` on the discovery documents only affects any caches
sitting in front of nginx (browsers, CDNs).

Every cacheable response carries an `X-Cache-Status` header (`HIT`, `MISS`, or `BYPASS`) so
you can verify the behavior:

```powershell
# HIT after the first request (discovery documents)
(Invoke-WebRequest http://localhost:4200/.well-known/ucp).Headers['X-Cache-Status']

# no cache header — always proxied (catalog API)
(Invoke-WebRequest -Method Post http://localhost:4200/ucp/v1/catalog/search `
  -ContentType 'application/json' -Body '{ "query": "Microsoft" }').Headers['X-Cache-Status']
```

## Trying It Out

```powershell
# Discover the profile
Invoke-RestMethod http://localhost:4200/.well-known/ucp | ConvertTo-Json -Depth 6

# Read the OpenAPI documentation
Invoke-RestMethod http://localhost:4200/ucp/v1/openapi.json | ConvertTo-Json -Depth 8

# Search the catalog
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/search `
  -ContentType 'application/json' -Body '{ "query": "Microsoft" }' | ConvertTo-Json -Depth 8

# Look up a single product by identifier
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/lookup `
  -ContentType 'application/json' -Body '{ "ids": ["201807195"] }' | ConvertTo-Json -Depth 8

# Look up multiple products in one batch
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/lookup `
  -ContentType 'application/json' -Body '{ "ids": ["201807195", "201807201"] }' | ConvertTo-Json -Depth 8

# Fetch a single product's full detail
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/product `
  -ContentType 'application/json' -Body '{ "id": "201807195" }' | ConvertTo-Json -Depth 8

# Fetch a variation master's full detail (all variants, options, selected)
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/product `
  -ContentType 'application/json' -Body '{ "id": "201807231" }' | ConvertTo-Json -Depth 10

# Narrow a master to a chosen configuration (selected acts like the storefront's option pickers)
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/product `
  -ContentType 'application/json' -Body '{ "id": "201807231", "selected": [{ "name": "Hard drive size", "label": "512GB" }, { "name": "Display Size", "label": "15\"" }] }' | ConvertTo-Json -Depth 10

# Relax the lowest-priority option when the combination does not exist (preferences keeps earlier options)
Invoke-RestMethod -Method Post http://localhost:4200/ucp/v1/catalog/product `
  -ContentType 'application/json' -Body '{ "id": "201807231", "selected": [{ "name": "Hard drive size", "label": "1TB" }, { "name": "Display Size", "label": "17\"" }], "preferences": ["Hard drive size", "Display Size"] }' | ConvertTo-Json -Depth 10
```

## Playground

The service ships an interactive **agent playground** at `/ucp/playground`
that simulates a chat between a shopping agent and this store over UCP. Every agent turn is a
real UCP call, and each one is expandable to reveal the exact request/response, the ICM work
behind the scenes, **and** a live conformance verdict. It talks to its own origin, so it works
wherever the service is reachable:

- Standalone container: <http://localhost:4000/ucp/playground>
- Behind the PWA nginx: <http://localhost:4200/ucp/playground> (the `/ucp/` route is already proxied)

What it covers:

- **Discovery** runs automatically on the first message (`GET /.well-known/ucp`).
- **Search** — type a free-text query, or paste comma-separated SKUs to resolve them via a
  batch **Lookup** instead.
- **Lookup** — resolved products render as rich tiles; a master also shows a
  **Configure options ▸** action (simple products, which have nothing to configure, do not).
- **Detail** (`POST /catalog/product`) — reached two ways: the **Details ▸** link on any search
  result (every product kind) and the **Configure options ▸** action on a master's lookup tile.
  It opens the full product, and for a master adds clickable option values that re-issue the
  call with `selected` to narrow the configuration live.
- **Conformance** — each turn shows a ✓/⚠/✗ badge; expand it (or toggle **Developer mode**)
  to see the request/response plus the same schema + behaviour validation as the validator.

No configuration or separate server is required; open the URL in a browser.

## Validator

The **conformance validator** at `/ucp/validator` is an interactive, same-origin page that
calls the live endpoints and reports how conformant each response is:

- Standalone container: <http://localhost:4000/ucp/validator>
- Behind the PWA nginx: <http://localhost:4200/ucp/validator>

Each tab (Search, Lookup, Product, Profile) builds a request, shows the raw response, and
lists findings as **errors / warnings / info**. Two validation layers run:

1. **Official JSON Schema (ajv).** It fetches the ucp.dev catalog schemas for the configured
   version, resolves the entire `$ref` graph (draft 2020-12), and validates the response
   against the concrete `search_response` / `lookup_response` / `get_product_response`
   sub-schemas. Requires outbound access to `ucp.dev`; if unreachable it falls back to the
   behaviour rules and says so.
2. **Behaviour rules.** The spec's MUST/SHOULD text that a schema cannot express — e.g. the
   UCP envelope, HTTP-200-for-business-outcomes, `price_range` coherence, and the lookup
   `inputs` correlation.

The Product tab also exposes `selected` and `preferences` inputs so you can exercise the
variant-narrowing feature described above.

## Architecture

The service is intentionally small and self-contained. Only `src/config.ts` reads the
environment; every other module operates on a plain configuration object. The Express
application is assembled in `src/app.ts` and started by `src/server.ts`.

The source is grouped by concern so that further UCP capabilities can be added alongside
the existing catalog surface:

```
src/
  server.ts  app.ts  config.ts  logger.ts   # bootstrap and cross-cutting concerns
  icm/                                       # ICM REST client, types and errors
  catalog/                                   # catalog Search/Lookup routes, validation, mapping
  discovery/                                 # UCP profile and OpenAPI documents
```

Because the scope is deliberately non-transactional, this is not a permanent architecture
decision for all future UCP stages. When transactional capabilities (cart, checkout,
payment, identity linking, signing) are added, they should be added as sibling folders
(e.g. `cart/`, `checkout/`) and the deployment and boundaries should be re-evaluated.

## Further References

- [UCP Specification](https://ucp.dev/)
