import { TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';

import { PWAUrlSerializer } from './pwa-url.serializer';

describe('Pwa Url Serializer', () => {
  let urlSerializer: UrlSerializer;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: UrlSerializer, useClass: PWAUrlSerializer }] });
    urlSerializer = TestBed.inject(UrlSerializer);
  });

  it('should deal with parenthesis in parameter names', () => {
    const tree = urlSerializer.parse('/path/a/b/c?param=(value)');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/b/c?param=(value)"`);
  });

  it('should deal with parenthesis in path segment names', () => {
    const tree = urlSerializer.parse('/path/a/(segmentname)');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/(segmentname)"`);
  });

  it('should remove matrix parameters from URL', () => {
    const tree = urlSerializer.parse('/path/a/b/c;matrix=value');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/b/c"`);
  });

  it('should remove multiple matrix parameters from URL', () => {
    const tree = urlSerializer.parse('/path/a/b/c;matrix=value;matrix2=value2');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/b/c"`);
  });

  it('should remove matrix parameters and keep query params in URL', () => {
    const tree = urlSerializer.parse('/path/a/b/c;matrix=value?test=dummy&foo=bar');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/b/c?test=dummy&foo=bar"`);
  });

  it('should remove matrix parameters and keep query params in URL preserving semicolons in query params', () => {
    const tree = urlSerializer.parse('/path/a/b/c;matrix=value?test=dummy%3btest&foo=bar');
    const result = urlSerializer.serialize(tree);
    expect(result).toMatchInlineSnapshot(`"/path/a/b/c?test=dummy;test&foo=bar"`);
  });
});
