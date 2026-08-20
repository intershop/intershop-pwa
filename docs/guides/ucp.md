<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# UCP (Universal Commerce Protocol)

- [Overview](#overview)
- [Scope](#scope)
- [Exposed Endpoints](#exposed-endpoints)
- [Configuration](#configuration)
- [Public Access Behind nginx](#public-access-behind-nginx)
- [Trying It Out](#trying-it-out)
- [Architecture Notes](#architecture-notes)
- [Further References](#further-references)

## Overview

[UCP](https://ucp.dev/) (Universal Commerce Protocol) is an open standard that lets AI agents and other platforms discover and interact with commerce businesses in a machine-readable way.
A business publishes a profile under `/.well-known/ucp` that declares which UCP capabilities it supports.

The PWA ships a small, self-contained UCP module that advertises non-transactional catalog capabilities (Search and Lookup) over the existing ICM REST API.
Transactional capabilities such as cart, checkout, payment and order placement are intentionally not implemented.

## Scope

The module implements a deliberately small, non-transactional scope.

Included:

- A machine-readable UCP profile under `/.well-known/ucp`.
- Declaration of the catalog Search (`dev.ucp.shopping.catalog.search`) and Lookup (`dev.ucp.shopping.catalog.lookup`) capabilities.
- OpenAPI documentation for the declared capabilities.
- UCP-conformant Search and Lookup endpoints backed by the ICM product REST API.

Excluded:

- All transactional flows (cart, checkout, payment, order placement, order management).
- Any capability that requires authentication, signing, authorization, idempotency, or payment guarantees.

## Exposed Endpoints

The module registers the following routes on the PWA server.

| Method | Path                      | Description                                          |
| ------ | ------------------------- | ---------------------------------------------------- |
| `GET`  | `/.well-known/ucp`        | The public, machine-readable business profile.       |
| `GET`  | `/ucp/v1/openapi.json`    | OpenAPI documentation for Search and Lookup.         |
| `POST` | `/ucp/v1/catalog/search`  | UCP-conformant catalog Search (free-text).           |
| `POST` | `/ucp/v1/catalog/lookup`  | UCP-conformant catalog Lookup (batch by identifier). |
| `POST` | `/ucp/v1/catalog/product` | Single-product detail lookup.                        |

Product prices are returned as integer minor units (for example cents) together with an ISO 4217 currency code, as required by the UCP catalog model.

## Configuration

The module reuses the storefront's ICM configuration and can be tuned with the following environment variables.

| Variable                          | Default                                | Description                             |
| --------------------------------- | -------------------------------------- | --------------------------------------- |
| `ICM_BASE_URL`                    | environment `icmBaseURL`               | Base URL of the ICM backend.            |
| `ICM_SERVER`                      | `INTERSHOP/rest/WFS`                   | ICM REST server path.                   |
| `UCP_ICM_CHANNEL` / `ICM_CHANNEL` | environment `icmChannel`               | ICM channel the catalog is served from. |
| `ICM_APPLICATION`                 | `-`                                    | ICM application.                        |
| `UCP_LOCALE`                      | environment `defaultLocale` or `en_US` | Locale used for catalog requests.       |
| `UCP_CURRENCY`                    | `USD`                                  | Currency used for catalog prices.       |

The profile `endpoint` and product page URLs are derived from the incoming request origin, so they are correct for each deployment domain without additional configuration.

## Public Access Behind nginx

UCP discovery must be publicly reachable.
When the PWA runs behind the provided nginx setup with `BASIC_AUTH` enabled, the `/.well-known/ucp` and `/ucp/` paths are exempted from basic authentication in `nginx/templates/multi-channel.conf.tmpl` so agents can reach them.

## Trying It Out

Start the PWA locally and query the endpoints.

```bash
# Discover the profile
curl -i http://localhost:4200/.well-known/ucp

# Read the OpenAPI documentation
curl -i http://localhost:4200/ucp/v1/openapi.json

# Search the catalog
curl -i -X POST http://localhost:4200/ucp/v1/catalog/search \
  -H 'Content-Type: application/json' \
  -d '{ "query": "camera" }'

# Look up products by identifier
curl -i -X POST http://localhost:4200/ucp/v1/catalog/lookup \
  -H 'Content-Type: application/json' \
  -d '{ "ids": ["201807231-01"] }'
```

## Architecture Notes

The UCP module lives under `src/ssr/ucp` and is kept self-contained.
Only `ucp.config.ts` is coupled to the PWA environment; every other file operates on a plain configuration object.
The module is registered on the Express server through a single `registerUcp` call in `server.ts`.

This keeps the implementation independent enough to be extracted into a standalone service later, should transactional UCP capabilities be added.

## Further References

- [UCP Specification](https://ucp.dev/)
- [Guide - Well-Known Resources](./well-known-resources.md)
