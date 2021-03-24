import { TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';

import { CustomUrlSerializer } from './custom-url-serializer';

describe('Custom Url Serializer', () => {
  let urlSerializer: UrlSerializer;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }] });
    urlSerializer = TestBed.inject(UrlSerializer);
  });

  it('should deal with parenthesis in parameter names', () => {
    const tree = urlSerializer.parse('/path/a/b/c?param=(value)');
    const result = urlSerializer.serialize(tree);
    expect(result).toBe('/path/a/b/c?param=(value)');
  });

  it('should deal with parenthesis in path segment names', () => {
    const tree = urlSerializer.parse('/path/a/(segmentname)');
    const result = urlSerializer.serialize(tree);
    expect(result).toBe('/path/a/(segmentname)');
  });

  it('should deal with parenthesis in matrix parameters', () => {
    const tree = urlSerializer.parse('/path/a/b/c;(matrix-param)=value');
    const result = urlSerializer.serialize(tree);
    expect(result).toBe('/path/a/b/c;(matrix-param)=value');
  });
});
