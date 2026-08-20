/**
 * Lightweight request validation for the UCP catalog capability.
 *
 * Validating inbound payloads at the system boundary is a UCP requirement. The
 * module deliberately avoids a schema library to keep its runtime footprint
 * minimal and self-contained.
 *
 * The result uses optional `data`/`error` fields (rather than a discriminated
 * union) because the project compiles without `strictNullChecks`, where boolean
 * discriminant narrowing is unreliable.
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

export interface ValidationResult<T> {
  data?: T;
  error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !!value && !Array.isArray(value);
}

/** Validate the optional `pagination.limit`, returning it or a validation error. */
function validatePaginationLimit(pagination: unknown): ValidationResult<number> {
  if (pagination === undefined) {
    return {};
  }
  if (!isRecord(pagination)) {
    return { error: '`pagination` must be an object.' };
  }
  const { limit } = pagination;
  if (limit === undefined) {
    return {};
  }
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0) {
    return { error: '`pagination.limit` must be a positive integer.' };
  }
  return { data: limit };
}

/** Validate `POST /catalog/search` — requires at least a `query` or `filters`. */
export function validateSearchRequest(body: unknown): ValidationResult<CatalogSearchRequest> {
  if (!isRecord(body)) {
    return { error: 'Request body must be a JSON object.' };
  }
  const { query, filters, pagination } = body;
  if (query !== undefined && typeof query !== 'string') {
    return { error: '`query` must be a string.' };
  }
  if (filters !== undefined && !isRecord(filters)) {
    return { error: '`filters` must be an object.' };
  }
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  if (!hasQuery && filters === undefined) {
    return { error: 'Provide a `query` or `filters`.' };
  }
  const limit = validatePaginationLimit(pagination);
  if (limit.error) {
    return { error: limit.error };
  }
  return {
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
    return { error: '`ids` must be a non-empty array of strings.' };
  }
  const ids = body.ids.filter((id): id is string => typeof id === 'string' && id.length > 0);
  if (!ids.length) {
    return { error: '`ids` must contain at least one non-empty string.' };
  }
  return { data: { ids } };
}

/** Validate `POST /catalog/product` — requires a non-empty `id`. */
export function validateProductRequest(body: unknown): ValidationResult<CatalogProductRequest> {
  if (!isRecord(body) || typeof body.id !== 'string' || !body.id.length) {
    return { error: '`id` must be a non-empty string.' };
  }
  return { data: { id: body.id } };
}
