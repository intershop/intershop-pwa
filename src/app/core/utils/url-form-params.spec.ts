import { HttpParams } from '@angular/common/http';

import { appendFormParamsToHttpParams, formParamsToString, stringToFormParams } from './url-form-params';

describe('Url Form Params', () => {
  describe('stringToFormParams', () => {
    it('should return empty object for invalid input', () => {
      expect(stringToFormParams(undefined)).toMatchInlineSnapshot(`{}`);
      expect(stringToFormParams('')).toMatchInlineSnapshot(`{}`);
      expect(stringToFormParams('test')).toMatchInlineSnapshot(`{}`);
    });

    it('should handle single value transformation for single parameters', () => {
      expect(stringToFormParams('test=a')).toMatchInlineSnapshot(`
        {
          "test": [
            "a",
          ],
        }
      `);
    });

    it('should handle multi value transformation for single parameters', () => {
      expect(stringToFormParams('test=a,b')).toMatchInlineSnapshot(`
        {
          "test": [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should respect separator option when handling input', () => {
      expect(stringToFormParams('foo=a_or_b&bar=c', '_or_')).toMatchInlineSnapshot(`
        {
          "bar": [
            "c",
          ],
          "foo": [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should not fail if string starts with &', () => {
      expect(stringToFormParams('&test=a')).toMatchInlineSnapshot(`
        {
          "test": [
            "a",
          ],
        }
      `);
    });

    it('should handle complex strings for input', () => {
      expect(stringToFormParams('test=a,b&foo=c&bar=d,e')).toMatchInlineSnapshot(`
        {
          "bar": [
            "d",
            "e",
          ],
          "foo": [
            "c",
          ],
          "test": [
            "a",
            "b",
          ],
        }
      `);
    });
  });

  describe('formParamsToString', () => {
    it('should return empty strings for falsy input', () => {
      expect(formParamsToString(undefined)).toMatchInlineSnapshot(`""`);
      expect(formParamsToString({})).toMatchInlineSnapshot(`""`);
    });

    it('should return empty string values for falsy or empty values', () => {
      expect(formParamsToString({ test: undefined })).toMatchInlineSnapshot(`""`);
      expect(formParamsToString({ test: [] })).toMatchInlineSnapshot(`""`);
    });

    it('should handle complex examples for given input', () => {
      expect(
        formParamsToString({
          bar: ['d', 'e'],
          foo: ['c'],
          test: ['a', 'b'],
          foobar: [],
        })
      ).toMatchInlineSnapshot(`"bar=d,e&foo=c&test=a,b"`);
    });

    it('should respect the separator option when merging form params', () => {
      expect(
        formParamsToString(
          {
            bar: ['d', 'e'],
            foo: ['c'],
          },
          '_or_'
        )
      ).toMatchInlineSnapshot(`"bar=d_or_e&foo=c"`);
    });

    it('should url-encode the incoming val', () => {
      expect(formParamsToString({ test: ['Laptops & Convertibles'] })).toMatchInlineSnapshot(
        `"test=Laptops%20%26%20Convertibles"`
      );
    });

    it('should not url-encode the given seperator', () => {
      expect(formParamsToString({ test: ['Laptops & Convertibles', 'Desktop Computers'] })).toMatchInlineSnapshot(
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
