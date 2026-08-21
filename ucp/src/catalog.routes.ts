import express, { Request } from 'express';

import { toUcpProduct } from './catalog.mapper';
import { validateLookupRequest, validateProductRequest, validateSearchRequest } from './catalog.validation';
import { CATALOG_DEFAULT_LIMIT, CATALOG_MAX_LIMIT, CATALOG_MAX_LOOKUP_IDS, UCP_VERSION, UcpConfig } from './config';
import { decodeCursor, encodeCursor } from './cursor';
import { IcmCatalogClient } from './icm-client';
import { IcmError } from './icm.error';
import { sendUcpError } from './errors';

/**
 * UCP Catalog capability (`dev.ucp.shopping.catalog.search` / `.lookup`).
 *
 * REST binding per https://ucp.dev/specification/catalog/ :
 *   POST /catalog/search   — free-text search
 *   POST /catalog/lookup   — batch resolve by identifier
 *   POST /catalog/product  — single-product detail
 *
 * Each operation wraps the ICM product REST API and maps results to the UCP
 * Product/Variant model. Non-transactional and read-only by design.
 */

/** Absolute origin of the incoming request (honours proxy `X-Forwarded-*`). */
function requestOrigin(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}

/** UCP response envelope for a catalog capability. */
function catalogUcp(capability: 'lookup' | 'search', status?: 'error'): Record<string, unknown> {
  return {
    version: UCP_VERSION,
    ...(status ? { status } : {}),
    capabilities: { [`dev.ucp.shopping.catalog.${capability}`]: [{ version: UCP_VERSION }] },
  };
}

/** Extract the SKU from an ICM link `uri` such as `.../products/849899`. */
function skuFromUri(uri: string | undefined): string | undefined {
  if (!uri) {
    return undefined;
  }
  const match = /\/products\/([^/;?]+)/.exec(uri);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function createCatalogRouter(config: UcpConfig): express.Router {
  const router = express.Router();
  const client = new IcmCatalogClient(config);

  // Product page URLs point at the storefront, not this service.
  const storefrontBaseUrl = (req: Request): string => config.storefrontBaseUrl ?? requestOrigin(req);

  router.use(express.json());

  router.post('/catalog/search', async (req, res) => {
    const parsed = validateSearchRequest(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: { type: 'invalid_request', message: parsed.error } });
      return;
    }

    // Validation guarantees a non-empty query.
    const query = (parsed.data.query ?? '').trim();
    const limit = Math.min(parsed.data.pagination?.limit ?? CATALOG_DEFAULT_LIMIT, CATALOG_MAX_LIMIT);
    const offset = decodeCursor(parsed.data.pagination?.cursor);
    const context = {
      currency: config.currency,
      icmBaseUrl: config.icmBaseUrl,
      storefrontBaseUrl: storefrontBaseUrl(req),
    };

    try {
      const result = await client.searchProducts(query, limit, offset);
      const stubs = result.elements ?? [];
      const skus = stubs.map(stub => stub.sku ?? skuFromUri(stub.uri)).filter((sku): sku is string => Boolean(sku));
      const products = await Promise.all(skus.map(async sku => toUcpProduct(await client.getProduct(sku), context)));
      const total = result.total ?? offset + stubs.length;
      const nextOffset = offset + stubs.length;
      const hasNextPage = nextOffset < total;

      res.json({
        ucp: catalogUcp('search'),
        products,
        pagination: {
          has_next_page: hasNextPage,
          total_count: total,
          ...(hasNextPage ? { cursor: encodeCursor(nextOffset) } : {}),
        },
      });
    } catch (error) {
      sendUcpError(res, error);
    }
  });

  router.post('/catalog/lookup', async (req, res) => {
    const parsed = validateLookupRequest(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: { type: 'invalid_request', message: parsed.error } });
      return;
    }

    if (parsed.data.ids.length > CATALOG_MAX_LOOKUP_IDS) {
      res.status(400).json({
        error: {
          type: 'request_too_large',
          message: `Too many ids; the maximum batch size is ${CATALOG_MAX_LOOKUP_IDS}.`,
        },
      });
      return;
    }

    const ids = [...new Set(parsed.data.ids)];
    const baseContext = {
      currency: config.currency,
      icmBaseUrl: config.icmBaseUrl,
      storefrontBaseUrl: storefrontBaseUrl(req),
    };

    try {
      const products = [];
      const notFound: string[] = [];
      for (const id of ids) {
        try {
          const product = await client.getProduct(id);
          products.push(toUcpProduct(product, { ...baseContext, input: { id, match: 'exact' } }));
        } catch (error) {
          if (error instanceof IcmError && error.status === 404) {
            notFound.push(id);
          } else {
            throw error;
          }
        }
      }

      res.json({
        ucp: catalogUcp('lookup'),
        products,
        // Business outcome: unknown ids reported as info messages (HTTP 200).
        ...(notFound.length
          ? { messages: notFound.map(id => ({ type: 'info', code: 'not_found', content: id })) }
          : {}),
      });
    } catch (error) {
      sendUcpError(res, error);
    }
  });

  router.post('/catalog/product', async (req, res) => {
    const parsed = validateProductRequest(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: { type: 'invalid_request', message: parsed.error } });
      return;
    }

    const { id } = parsed.data;
    const context = {
      currency: config.currency,
      icmBaseUrl: config.icmBaseUrl,
      storefrontBaseUrl: storefrontBaseUrl(req),
      input: { id, match: 'exact' as const },
    };

    try {
      const product = await client.getProduct(id);
      res.json({ ucp: catalogUcp('lookup'), product: toUcpProduct(product, context) });
    } catch (error) {
      // A missing product is a business outcome: HTTP 200 with an error envelope.
      if (error instanceof IcmError && error.status === 404) {
        res.status(200).json({
          ucp: catalogUcp('lookup', 'error'),
          messages: [
            { type: 'error', code: 'not_found', content: `Product not found: ${id}`, severity: 'unrecoverable' },
          ],
        });
        return;
      }
      sendUcpError(res, error);
    }
  });

  return router;
}
