import { HttpErrorHelper } from './http-error.helper';

describe('Http Error Helper', () => {
  describe('escapeParameters', () => {
    it('should return the message unchanged if no parameters are available', () => {
      expect(HttpErrorHelper.escapeParameters('The <b>address</b> is invalid.', undefined)).toEqual(
        'The <b>address</b> is invalid.'
      );
      expect(HttpErrorHelper.escapeParameters(undefined, { sku: '<b>1</b>' })).toBeUndefined();
    });

    it('should escape the parameter values and keep the trusted HTML of the message', () => {
      const sku = '<h1>VULN003</h1><img src=x onerror=alert(document.domain)>';

      expect(
        HttpErrorHelper.escapeParameters(`The product with SKU <b>'${sku}'</b> could not be found.`, { sku })
      ).toMatchInlineSnapshot(
        `"The product with SKU <b>'&lt;h1&gt;VULN003&lt;/h1&gt;&lt;img src=x onerror=alert(document.domain)&gt;'</b> could not be found."`
      );
    });

    it('should escape longer parameter values first', () => {
      expect(
        HttpErrorHelper.escapeParameters('Values <x> and <x><y> are invalid.', { short: '<x>', long: '<x><y>' })
      ).toMatchInlineSnapshot(`"Values &lt;x&gt; and &lt;x&gt;&lt;y&gt; are invalid."`);
    });

    it('should ignore parameters that are not strings', () => {
      expect(
        HttpErrorHelper.escapeParameters('The <b>address</b> is invalid.', {
          scopes: ['Addresses'],
          empty: '',
        })
      ).toEqual('The <b>address</b> is invalid.');
    });

    it('should not interpret replacement tokens in parameter values', () => {
      const link = '<a href="https://example.invalid">$&</a>';

      expect(
        HttpErrorHelper.escapeParameters(`The product with SKU '${link}' could not be found.`, { sku: link })
      ).toMatchInlineSnapshot(
        `"The product with SKU '&lt;a href=&quot;https://example.invalid&quot;&gt;$&amp;&lt;/a&gt;' could not be found."`
      );
    });

    it('should not escape overlapping or duplicate parameter values twice', () => {
      expect(
        HttpErrorHelper.escapeParameters('The SKU A&B is invalid.', { sku: 'A&B', productSku: 'A&B', field: '&' })
      ).toEqual('The SKU A&amp;B is invalid.');
    });
  });
});
