/**
 * Lightweight request validation for the UCP catalog capability.
 *
 * Validating inbound payloads at the system boundary is a UCP requirement. The
 * service deliberately avoids a schema library to keep its footprint minimal.
 */

export interface CatalogSearchRequest {
  query?: string;
  filters?: {
    categories?: string[];
    price?: { min?: number; max?: number };
  };
  context?: Record<string, unknown>;
  pagination?: { limit?: number; cursor?: string };
}

export interface CatalogLookupRequest {
  ids: string[];
}

export interface CatalogProductRequest {
  id: string;
}

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !!value && !Array.isArray(value);
}

/** Validate the optional `pagination.limit`, returning it or a validation error. */
function validatePaginationLimit(pagination: unknown): ValidationResult<number | undefined> {
  if (pagination === undefined) {
    return { ok: true, data: undefined };
  }
  if (!isRecord(pagination)) {
    return { ok: false, error: '`pagination` must be an object.' };
  }
  const { limit } = pagination;
  if (limit === undefined) {
    return { ok: true, data: undefined };
  }
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0) {
    return { ok: false, error: '`pagination.limit` must be a positive integer.' };
  }
  return { ok: true, data: limit };
}

/** Validate `POST /catalog/search` — requires at least a `query` or `filters`. */
export function validateSearchRequest(body: unknown): ValidationResult<CatalogSearchRequest> {
  if (!isRecord(body)) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }
  const { query, filters, pagination } = body;
  if (query !== undefined && typeof query !== 'string') {
    return { ok: false, error: '`query` must be a string.' };
  }
  if (filters !== undefined && !isRecord(filters)) {
    return { ok: false, error: '`filters` must be an object.' };
  }
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  if (!hasQuery && filters === undefined) {
    return { ok: false, error: 'Provide a `query` or `filters`.' };
  }
  const limit = validatePaginationLimit(pagination);
  if (!limit.ok) {
    return { ok: false, error: limit.error };
  }
  return {
    ok: true,
    data: {
      query: typeof query === 'string' ? query : undefined,
      filters: filters as CatalogSearchRequest['filters'],
      pagination: limit.data !== undefined ? { limit: limit.data } : undefined,
    },
  };
}

/** Validate `POST /catalog/lookup` — requires a non-empty array of string ids. */
export function validateLookupRequest(body: unknown): ValidationResult<CatalogLookupRequest> {
  if (!isRecord(body) || !Array.isArray(body.ids)) {
    return { ok: false, error: '`ids` must be a non-empty array of strings.' };
  }
  const ids = body.ids.filter((id): id is string => typeof id === 'string' && id.length > 0);
  if (!ids.length) {
    return { ok: false, error: '`ids` must contain at least one non-empty string.' };
  }
  return { ok: true, data: { ids } };
}

/** Validate `POST /catalog/product` — requires a non-empty `id`. */
export function validateProductRequest(body: unknown): ValidationResult<CatalogProductRequest> {
  if (!isRecord(body) || typeof body.id !== 'string' || !body.id.length) {
    return { ok: false, error: '`id` must be a non-empty string.' };
  }
  return { ok: true, data: { id: body.id } };
}
