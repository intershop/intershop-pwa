import * as using from 'jasmine-data-provider';
import { Price, PriceHelper } from './price.model';

describe('Price Helper', () => {
  describe('diff', () => {
    function dataProviderValid() {
      return [
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 10 } as Price,
          p2: { type: 'M', currencyMnemonic: 'USD', value: 9 } as Price,
          result: { type: 'M', currencyMnemonic: 'USD', value: 1 } as Price,
        },
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 10.99 } as Price,
          p2: { type: 'M', currencyMnemonic: 'USD', value: 9.45 } as Price,
          result: { type: 'M', currencyMnemonic: 'USD', value: 1.54 } as Price,
        },
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 8 } as Price,
          p2: { type: 'M', currencyMnemonic: 'USD', value: 9 } as Price,
          result: { type: 'M', currencyMnemonic: 'USD', value: -1 } as Price,
        },
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 8 } as Price,
          p2: { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price,
          result: { type: 'M', currencyMnemonic: 'USD', value: -1 } as Price,
        },
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 8.88888 } as Price,
          p2: { type: 'F', currencyMnemonic: 'USD', value: 3.55555 } as Price,
          result: { type: 'M', currencyMnemonic: 'USD', value: 5.33 } as Price,
        },
      ];
    }

    using(dataProviderValid, slice => {
      it(`should return ${slice.result.value} when diff'ing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(PriceHelper.diff(slice.p1, slice.p2)).toEqual(slice.result);
      });
    });

    function dataProviderInvalid() {
      return [
        {
          p1: undefined,
          p2: { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price,
          error: /.*undefined.*/,
        },
        {
          p1: { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price,
          p2: undefined,
          error: /.*undefined.*/,
        },
        {
          p1: { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price,
          p2: { type: 'F', value: 9 } as Price,
          error: /.*undefined.*/,
        },
        {
          p1: { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price,
          p2: { type: 'F', currencyMnemonic: 'USD' } as Price,
          error: /.*undefined.*/,
        },
        {
          p1: { type: 'M', currencyMnemonic: 'USD', value: 10 } as Price,
          p2: { type: 'M', currencyMnemonic: 'EUR', value: 9 } as Price,
          error: /.*currency.*/,
        },
      ];
    }

    using(dataProviderInvalid, slice => {
      it(`should throw something like ${slice.error} when diff'ing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(() => PriceHelper.diff(slice.p1, slice.p2)).toThrowError(slice.error);
      });
    });
  });

  describe('invert', () => {
    const price = { type: 'F', currencyMnemonic: 'USD', value: 9 } as Price;

    it('should return inverted price when called', () => {
      const invertedPrice = PriceHelper.invert(price);
      expect(invertedPrice.value).toEqual(-9);
    });
  });
});
