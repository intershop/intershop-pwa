import { validateLookupRequest, validateProductRequest, validateSearchRequest } from './catalog.validation';

describe('Catalog Validation', () => {
  describe('validateSearchRequest', () => {
    it('should accept a request with a query', () => {
      const result = validateSearchRequest({ query: 'laptop' });

      expect(result.error).toBeUndefined();
      expect(result.data.query).toBe('laptop');
    });

    it('should accept a request with filters only', () => {
      const result = validateSearchRequest({ filters: { categories: ['computers'] } });

      expect(result.error).toBeUndefined();
      expect(result.data.filters).toEqual({ categories: ['computers'] });
    });

    it('should reject a request without a query or filters', () => {
      expect(validateSearchRequest({}).error).toBeString();
    });

    it('should reject a non-object body', () => {
      expect(validateSearchRequest('nope').error).toBeString();
    });

    it('should reject an invalid pagination limit', () => {
      expect(validateSearchRequest({ query: 'x', pagination: { limit: -1 } }).error).toBeString();
      expect(validateSearchRequest({ query: 'x', pagination: { limit: 1.5 } }).error).toBeString();
    });

    it('should pass through a valid pagination limit', () => {
      const result = validateSearchRequest({ query: 'x', pagination: { limit: 20 } });

      expect(result.data.pagination).toEqual({ limit: 20 });
    });
  });

  describe('validateLookupRequest', () => {
    it('should accept a non-empty ids array', () => {
      const result = validateLookupRequest({ ids: ['a', 'b'] });

      expect(result.data.ids).toEqual(['a', 'b']);
    });

    it('should drop empty string ids', () => {
      const result = validateLookupRequest({ ids: ['a', '', 'b'] });

      expect(result.data.ids).toEqual(['a', 'b']);
    });

    it('should reject a missing or empty ids array', () => {
      expect(validateLookupRequest({}).error).toBeString();
      expect(validateLookupRequest({ ids: [] }).error).toBeString();
      expect(validateLookupRequest({ ids: [''] }).error).toBeString();
    });
  });

  describe('validateProductRequest', () => {
    it('should accept a non-empty id', () => {
      expect(validateProductRequest({ id: '12345' }).data).toEqual({ id: '12345' });
    });

    it('should reject a missing or empty id', () => {
      expect(validateProductRequest({}).error).toBeString();
      expect(validateProductRequest({ id: '' }).error).toBeString();
    });
  });
});
