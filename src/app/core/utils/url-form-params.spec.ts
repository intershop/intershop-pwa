import { HttpParams } from '@angular/common/http';

import { appendFormParamsToHttpParams, formParamsToString, stringToFormParams } from './url-form-params';

describe('Url Form Params', () => {
  describe('stringToFormParams', () => {
    it('should return empty object for invalid input', () => {
      expect(stringToFormParams(undefined)).toMatchInlineSnapshot(`Object {}`);
      expect(stringToFormParams('')).toMatchInlineSnapshot(`Object {}`);
      expect(stringToFormParams('test')).toMatchInlineSnapshot(`Object {}`);
    });

    it('should handle single value transformation for single parameters', () => {
      expect(stringToFormParams('test=a')).toMatchInlineSnapshot(`
        Object {
          "test": Array [
            "a",
          ],
        }
      `);
    });

    it('should handle multi value transformation for single parameters', () => {
      expect(stringToFormParams('test=a,b')).toMatchInlineSnapshot(`
        Object {
          "test": Array [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should respect separator option when handling input', () => {
      expect(stringToFormParams('foo=a_or_b&bar=c', '_or_')).toMatchInlineSnapshot(`
        Object {
          "bar": Array [
            "c",
          ],
          "foo": Array [
            "a",
            "b",
          ],
        }
      `);
    });

    it('should not fail if string starts with &', () => {
      expect(stringToFormParams('&test=a')).toMatchInlineSnapshot(`
        Object {
          "test": Array [
            "a",
          ],
        }
      `);
    });

    it('should handle complex strings for input', () => {
      expect(stringToFormParams('test=a,b&foo=c&bar=d,e')).toMatchInlineSnapshot(`
        Object {
          "bar": Array [
            "d",
            "e",
          ],
          "foo": Array [
            "c",
          ],
          "test": Array [
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
