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

| Method | Path                      | Description                                          |
| ------ | ------------------------- | ---------------------------------------------------- |
| `GET`  | `/health`                 | Liveness/readiness probe.                            |
| `GET`  | `/.well-known/ucp`        | The public, machine-readable business profile.       |
| `GET`  | `/ucp/v1/openapi.json`    | OpenAPI documentation for Search and Lookup.         |
| `POST` | `/ucp/v1/catalog/search`  | UCP-conformant catalog Search (free-text).           |
| `POST` | `/ucp/v1/catalog/lookup`  | UCP-conformant catalog Lookup (batch by identifier). |
| `POST` | `/ucp/v1/catalog/product` | Single-product detail lookup.                        |

Product prices are returned as integer minor units (for example cents) together with an
ISO 4217 currency code, as required by the UCP catalog model.

## Configuration

Configuration is read from environment variables (see [.env.example](./.env.example)).

| Variable              | Default                            | Description                                        |
| --------------------- | ---------------------------------- | -------------------------------------------------- |
| `UCP_PORT`            | `4000`                             | Port the service listens on.                       |
| `UCP_PUBLIC_BASE_URL` | request origin                     | Fixed public origin advertised in the profile.     |
| `STOREFRONT_BASE_URL` | request origin                     | Storefront origin used to build product page URLs. |
| `ICM_BASE_URL`        | `https://develop.icm.intershop.de` | Base URL of the ICM backend.                       |
| `ICM_SERVER`          | `INTERSHOP/rest/WFS`               | ICM REST server path.                              |
| `ICM_CHANNEL`         | `inSPIRED-inTRONICS-Site`          | ICM channel the catalog is served from.            |
| `ICM_APPLICATION`     | `-`                                | ICM application.                                   |
| `ICM_LOCALE`          | `en_US`                            | Locale used for catalog requests.                  |
| `ICM_CURRENCY`        | `USD`                              | Currency used for catalog prices.                  |

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

```bash
# from the repository root
docker compose up --build
curl -i http://localhost:4200/.well-known/ucp
```

Because the requests arrive through nginx, the profile `endpoint` and product page URLs are
derived from the storefront origin automatically; `UCP_PUBLIC_BASE_URL` and
`STOREFRONT_BASE_URL` only need to be set to override that behavior.

## Trying It Out

```bash
# Discover the profile
curl -i http://localhost:4000/.well-known/ucp

# Read the OpenAPI documentation
curl -i http://localhost:4000/ucp/v1/openapi.json

# Search the catalog
curl -i -X POST http://localhost:4000/ucp/v1/catalog/search \
  -H 'Content-Type: application/json' \
  -d '{ "query": "camera" }'

# Look up products by identifier
curl -i -X POST http://localhost:4000/ucp/v1/catalog/lookup \
  -H 'Content-Type: application/json' \
  -d '{ "ids": ["201807231-01"] }'
```

## Architecture

The service is intentionally small and self-contained. Only `src/config.ts` reads the
environment; every other module operates on a plain configuration object. The Express
application is assembled in `src/app.ts` and started by `src/server.ts`.

Because the scope is deliberately non-transactional, this is not a permanent architecture
decision for all future UCP stages. When transactional capabilities (cart, checkout,
payment, identity linking, signing) are added, the deployment and boundaries should be
re-evaluated.

## Further References

- [UCP Specification](https://ucp.dev/)
