import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { HttpErrorHelper } from './http-error.helper';

const maliciousSku = '<h1>VULN003</h1><img src=x onerror=alert(document.domain)>';

describe('Http Error Helper', () => {
  describe('formatMessage', () => {
    it('should return undefined if no error or message is available', () => {
      expect(HttpErrorHelper.formatMessage(undefined)).toBeUndefined();
      expect(HttpErrorHelper.formatMessage(makeHttpError({ code: 'error.key' }))).toBeUndefined();
    });

    it('should return the message of an error without error feedback (text, header or other responses)', () => {
      expect(HttpErrorHelper.formatMessage(makeHttpError({ message: 'Bad <b>Request</b>' }))).toEqual(
        'Bad <b>Request</b>'
      );
    });

    it('should format an error of the ICM errors format with causes and escape the parameter values', () => {
      const error = makeHttpError({
        message: `The product could not be added to your cart. The product with SKU '${maliciousSku}' could not be found.`,
        errors: [
          {
            code: 'basket.add_line_item_not_successful.error',
            message: 'The product could not be added to your cart.',
            causes: [
              {
                code: 'basket.line_item.product_not_found.error',
                message: `The product with SKU '${maliciousSku}' could not be found.`,
                parameters: { sku: maliciousSku },
              },
            ],
          },
        ],
      });

      expect(HttpErrorHelper.formatMessage(error)).toMatchInlineSnapshot(
        `"<div>The product could not be added to your cart.</div><div>The product with SKU '&lt;h1&gt;VULN003&lt;/h1&gt;&lt;img src=x onerror=alert(document.domain)&gt;' could not be found.</div>"`
      );
    });

    it('should format an error of the ICM messages format (ADR) with causes only', () => {
      const error = makeHttpError({
        message: "The value of the 'punchout.locale' field is invalid.",
        errors: [
          {
            code: 'intershop.cxml.punchout.configuration.error',
            message: undefined,
            causes: [
              {
                code: 'intershop.cxml.punchout.locale.value.invalid',
                message: "The value of the 'punchout.locale' field is invalid.",
              },
            ],
          },
        ],
      });

      expect(HttpErrorHelper.formatMessage(error)).toMatchInlineSnapshot(
        `"The value of the 'punchout.locale' field is invalid."`
      );
    });

    it('should format multiple errors as separate lines', () => {
      const error = makeHttpError({
        errors: [
          { code: 'error1', message: 'First error', causes: [{ message: 'First cause' }] },
          { code: 'error2', message: 'Second error' },
        ],
      });

      expect(HttpErrorHelper.formatMessage(error)).toMatchInlineSnapshot(
        `"<div>First error</div><div>First cause</div><div>Second error</div>"`
      );
    });

    it('should fall back to the message if the error feedback contains no messages', () => {
      const error = makeHttpError({ message: 'General error', errors: [{ code: 'error', message: undefined }] });

      expect(HttpErrorHelper.formatMessage(error)).toEqual('General error');
    });
  });

  describe('formatFeedback', () => {
    it('should keep the trusted HTML of the messages', () => {
      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: 'Only <b>5</b> items are available.',
          causes: [{ message: 'See our <a href="/page/delivery">delivery terms</a>.' }],
        })
      ).toMatchInlineSnapshot(
        `"<div>Only <b>5</b> items are available.</div><div>See our <a href="/page/delivery">delivery terms</a>.</div>"`
      );
    });

    it('should escape the parameter values of the feedback in the message and the causes', () => {
      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: 'The product <i><b>1</b></i> is not available.',
          parameters: { sku: '<b>1</b>' },
          causes: [{ message: 'Remove <b>1</b> from the cart.' }],
        })
      ).toMatchInlineSnapshot(
        `"<div>The product <i>&lt;b&gt;1&lt;/b&gt;</i> is not available.</div><div>Remove &lt;b&gt;1&lt;/b&gt; from the cart.</div>"`
      );
    });

    it('should escape longer parameter values first', () => {
      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: 'Values <x> and <x><y> are invalid.',
          parameters: { short: '<x>', long: '<x><y>' },
        })
      ).toMatchInlineSnapshot(`"Values &lt;x&gt; and &lt;x&gt;&lt;y&gt; are invalid."`);
    });

    it('should ignore parameters that are not strings', () => {
      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: 'The <b>address</b> is invalid.',
          parameters: { scopes: ['Addresses'] as unknown as string, empty: '' },
        })
      ).toEqual('The <b>address</b> is invalid.');
    });

    it('should not interpret replacement tokens in parameter values', () => {
      const link = '<a href="https://example.invalid">$&</a>';

      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: `The product with SKU '${link}' could not be found.`,
          parameters: { sku: link },
        })
      ).toMatchInlineSnapshot(
        `"The product with SKU '&lt;a href=&quot;https://example.invalid&quot;&gt;$&amp;&lt;/a&gt;' could not be found."`
      );
    });

    it('should not escape overlapping or duplicate parameter values twice', () => {
      expect(
        HttpErrorHelper.formatFeedback({
          code: 'error',
          message: 'The SKU A&B is invalid.',
          parameters: { sku: 'A&B', productSku: 'A&B', field: '&' },
        })
      ).toEqual('The SKU A&amp;B is invalid.');
    });
  });
});
