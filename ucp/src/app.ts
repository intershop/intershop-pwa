import express, { Request } from 'express';

import { UCP_BASE_PATH, UcpConfig } from './config';
import { createCatalogRouter } from './catalog/routes';
import { buildUcpOpenApi } from './discovery/openapi';
import { buildUcpProfile } from './discovery/profile';

/** Absolute origin of the incoming request (honours proxy `X-Forwarded-*`). */
function requestOrigin(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}

/**
 * Assembles the Express application exposing the UCP (https://ucp.dev) discovery
 * and catalog surfaces:
 *  - `GET  /health`                 — liveness/readiness probe
 *  - `GET  /.well-known/ucp`        — the machine-readable business profile
 *  - `GET  /ucp/v1/openapi.json`    — OpenAPI docs for Search and Lookup
 *  - `POST /ucp/v1/catalog/search`  — UCP-conformant catalog Search
 *  - `POST /ucp/v1/catalog/lookup`  — UCP-conformant catalog Lookup (batch)
 *  - `POST /ucp/v1/catalog/product` — single-product detail lookup
 *
 * Scope: non-transactional catalog discovery only.
 */
export function createApp(config: UcpConfig): express.Express {
  const app = express();
  app.set('trust proxy', true);
  app.disable('x-powered-by');

  const profileOrigin = (req: Request): string => config.publicBaseUrl ?? requestOrigin(req);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', icm: config.icmBaseUrl, channel: config.icmChannel });
  });

  // Publicly cacheable, unauthenticated business profile.
  app.get('/.well-known/ucp', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json(buildUcpProfile(profileOrigin(req)));
  });

  // OpenAPI documentation for the declared capabilities.
  app.get(`${UCP_BASE_PATH}/openapi.json`, (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json(buildUcpOpenApi(profileOrigin(req)));
  });

  // Non-transactional catalog Search and Lookup over the ICM REST API.
  app.use(UCP_BASE_PATH, createCatalogRouter(config));

  return app;
}
