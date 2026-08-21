import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateLookupRequest, validateProductRequest, validateSearchRequest } from './catalog.validation';

describe('validateSearchRequest', () => {
  it('accepts a request with a query', () => {
    const result = validateSearchRequest({ query: 'laptop' });

    assert.ok(result.ok);
    assert.equal(result.data.query, 'laptop');
  });

  it('accepts a query with optional filters', () => {
    const result = validateSearchRequest({ query: 'computer', filters: { categories: ['computers'] } });

    assert.ok(result.ok);
    assert.deepEqual(result.data.filters, { categories: ['computers'] });
  });

  it('rejects a filters-only request without a query', () => {
    assert.equal(validateSearchRequest({ filters: { categories: ['computers'] } }).ok, false);
  });

  it('rejects a request without a query', () => {
    assert.equal(validateSearchRequest({}).ok, false);
  });

  it('rejects a non-object body', () => {
    assert.equal(validateSearchRequest('nope').ok, false);
  });

  it('rejects an invalid pagination limit', () => {
    assert.equal(validateSearchRequest({ query: 'x', pagination: { limit: -1 } }).ok, false);
    assert.equal(validateSearchRequest({ query: 'x', pagination: { limit: 1.5 } }).ok, false);
  });

  it('passes through a valid pagination limit', () => {
    const result = validateSearchRequest({ query: 'x', pagination: { limit: 20 } });

    assert.ok(result.ok);
    assert.deepEqual(result.data.pagination, { limit: 20 });
  });

  it('passes through a pagination cursor', () => {
    const result = validateSearchRequest({ query: 'x', pagination: { cursor: 'MTA' } });

    assert.ok(result.ok);
    assert.deepEqual(result.data.pagination, { cursor: 'MTA' });
  });

  it('rejects a non-string cursor', () => {
    assert.equal(validateSearchRequest({ query: 'x', pagination: { cursor: 5 } }).ok, false);
  });
});

describe('validateLookupRequest', () => {
  it('accepts a non-empty ids array', () => {
    const result = validateLookupRequest({ ids: ['a', 'b'] });

    assert.ok(result.ok);
    assert.deepEqual(result.data.ids, ['a', 'b']);
  });

  it('drops empty string ids', () => {
    const result = validateLookupRequest({ ids: ['a', '', 'b'] });

    assert.ok(result.ok);
    assert.deepEqual(result.data.ids, ['a', 'b']);
  });

  it('rejects a missing or empty ids array', () => {
    assert.equal(validateLookupRequest({}).ok, false);
    assert.equal(validateLookupRequest({ ids: [] }).ok, false);
    assert.equal(validateLookupRequest({ ids: [''] }).ok, false);
  });
});

describe('validateProductRequest', () => {
  it('accepts a non-empty id', () => {
    const result = validateProductRequest({ id: '12345' });

    assert.ok(result.ok);
    assert.deepEqual(result.data, { id: '12345' });
  });

  it('rejects a missing or empty id', () => {
    assert.equal(validateProductRequest({}).ok, false);
    assert.equal(validateProductRequest({ id: '' }).ok, false);
  });
});
