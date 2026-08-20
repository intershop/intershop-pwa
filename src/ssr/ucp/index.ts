import { Express, Request } from 'express';

import { getLogger } from 'ish-core/utils/ssr-logging/ssr-logging.service';

import { createCatalogRouter } from './catalog.routes';
import { UCP_BASE_PATH, resolveUcpConfig } from './ucp.config';
import { buildUcpOpenApi } from './ucp.openapi';
import { buildUcpProfile } from './ucp.profile';

const logger = getLogger('UCP');

/** Absolute origin of the incoming request (honours proxy `X-Forwarded-*`). */
function requestOrigin(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}

/**
 * Registers the self-contained UCP (https://ucp.dev) discovery and catalog
 * surfaces on the given Express app:
 *  - `GET  /.well-known/ucp`        — the machine-readable business profile
 *  - `GET  /ucp/v1/openapi.json`    — OpenAPI docs for Search and Lookup
 *  - `POST /ucp/v1/catalog/search`  — UCP-conformant catalog Search
 *  - `POST /ucp/v1/catalog/lookup`  — UCP-conformant catalog Lookup (batch)
 *  - `POST /ucp/v1/catalog/product` — single-product detail lookup
 *
 * Scope: non-transactional catalog discovery only. Must be registered before the
 * static-file and SSR handlers so the `.well-known` path is not treated as a
 * static asset.
 */
export function registerUcp(server: Express): void {
  const config = resolveUcpConfig();

  // Publicly cacheable, unauthenticated business profile.
  server.get('/.well-known/ucp', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json(buildUcpProfile(requestOrigin(req)));
  });

  // OpenAPI documentation for the declared capabilities.
  server.get(`${UCP_BASE_PATH}/openapi.json`, (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json(buildUcpOpenApi(requestOrigin(req)));
  });

  // Non-transactional catalog Search and Lookup over the existing ICM REST API.
  server.use(UCP_BASE_PATH, createCatalogRouter(config));

  logger.info(
    { service: { name: 'ucp' }, url: { original: config.icmBaseUrl }, labels: { channel: config.icmChannel } },
    'UCP catalog discovery registered'
  );
}
