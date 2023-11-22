import { HttpParams } from '@angular/common/http';

import { URLFormParams } from './url-form-params';

describe('UrlFormParams', () => {
  describe('stringToFormParams', () => {
    it('should return empty object for invalid input', () => {
      expect(new URLFormParams(undefined)).toMatchInlineSnapshot(`{}`);
      expect(new URLFormParams('')).toMatchInlineSnapshot(`{}`);
      expect(new URLFormParams('test')).toMatchInlineSnapshot(`{}`);
    });

    it('should handle single value transformation for single parameters', () => {
      expect(new URLFormParams('test=a')).toMatchInlineSnapshot(`
        {
          "test": "a",
        }
      `);
    });

    it('should handle multi value transformation for single parameters', () => {
      expect(new URLFormParams('test=a,b')).toMatchInlineSnapshot(`
        {
          "test": [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should respect separator option when handling input', () => {
      expect(new URLFormParams('foo=a_or_b&bar=c', '_or_')).toMatchInlineSnapshot(`
        {
          "bar": "c",
          "foo": [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should not fail if string starts with &', () => {
      expect(new URLFormParams('&test=a')).toMatchInlineSnapshot(`
        {
          "test": "a",
        }
      `);
    });

    it('should handle complex strings for input', () => {
      expect(new URLFormParams('test=a,b&foo=c&bar=d,e')).toMatchInlineSnapshot(`
        {
          "bar": [
            "d",
            "e",
          ],
          "foo": "c",
          "test": [
            "a",
            "b",
          ],
        }
      `);
    });
  });

  describe('toURI', () => {
    it('should return empty strings for falsy input', () => {
      expect(new URLFormParams(undefined)).toMatchInlineSnapshot(`""`);
      expect(new URLFormParams({})).toMatchInlineSnapshot(`""`);
    });

    it('should return empty string values for falsy or empty values', () => {
      expect(new URLFormParams({ test: undefined })).toMatchInlineSnapshot(`""`);
      expect(new URLFormParams({ test: [] })).toMatchInlineSnapshot(`""`);
    });

    it('should handle complex examples for given input', () => {
      expect(
        new URLFormParams({
          bar: ['d', 'e'],
          foo: ['c'],
          test: ['a', 'b'],
          foobar: [],
        })
      ).toMatchInlineSnapshot(`"bar=d,e&foo=c&test=a,b"`);
    });

    it('should respect the separator option when merging form params', () => {
      expect(
        new URLFormParams(
          {
            bar: ['d', 'e'],
            foo: ['c'],
          },
          '_or_'
        )
      ).toMatchInlineSnapshot(`"bar=d_or_e&foo=c"`);
    });

    it('should url-encode the incoming val', () => {
      expect(new URLFormParams({ test: ['Laptops & Convertibles'] })).toMatchInlineSnapshot(
        `"test=Laptops%20%26%20Convertibles"`
      );
    });

    it('should not url-encode the given seperator', () => {
      expect(new URLFormParams({ test: ['Laptops & Convertibles', 'Desktop Computers'] })).toMatchInlineSnapshot(
        `"test=Laptops%20%26%20Convertibles,Desktop%20Computers"`
      );
    });
  });

  describe('appendFormParamsToHttpParams', () => {
    it('should return empty strings for falsy input', () => {
      expect(appendFormParamsToHttpParams(undefined).toString()).toMatchInlineSnapshot(`""`);
      expect(appendFormParamsToHttpParams({}).toString()).toMatchInlineSnapshot(`""`);
    });

    it('should return empty string values for falsy or empty values', () => {
      expect(appendFormParamsToHttpParams({ test: undefined }).toString()).toMatchInlineSnapshot(`""`);
      expect(appendFormParamsToHttpParams({ test: [] }).toString()).toMatchInlineSnapshot(`""`);
    });

    it('should handle complex examples for given input', () => {
      expect(
        appendFormParamsToHttpParams({
          bar: ['d', 'e'],
          foo: ['c'],
          test: ['a', 'b'],
          foobar: [],
        }).toString()
      ).toMatchInlineSnapshot(`"bar=d,e&foo=c&test=a,b"`);
    });

    it('should append to existing params when merging form params', () => {
      expect(
        appendFormParamsToHttpParams(
          {
            bar: ['d', 'e'],
            foo: ['c'],
          },
          new HttpParams().set('dummy', 'test')
        ).toString()
      ).toMatchInlineSnapshot(`"dummy=test&bar=d,e&foo=c"`);
    });

    it('should respect the separator option when merging form params', () => {
      expect(
        appendFormParamsToHttpParams(
          {
            bar: ['d', 'e'],
            foo: ['c'],
          },
          new HttpParams(),
          '_or_'
        ).toString()
      ).toMatchInlineSnapshot(`"bar=d_or_e&foo=c"`);
    });
  });
});
