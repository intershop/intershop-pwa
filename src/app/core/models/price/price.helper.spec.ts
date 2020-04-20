import * as using from 'jasmine-data-provider';

import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price, PriceHelper } from './price.model';

describe('Price Helper', () => {
  function dataProviderValid() {
    return [
      {
        p1: { type: 'Money', currency: 'USD', value: 10 } as Price,
        p2: { type: 'Money', currency: 'USD', value: 9 } as Price,
        diff: { type: 'Money', currency: 'USD', value: 1 } as Price,
        sum: { type: 'Money', currency: 'USD', value: 19 } as Price,
        min: { type: 'Money', currency: 'USD', value: 9 } as Price,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 10.99 } as Price,
        p2: { type: 'Money', currency: 'USD', value: 9.45 } as Price,
        diff: { type: 'Money', currency: 'USD', value: 1.54 } as Price,
        sum: { type: 'Money', currency: 'USD', value: 20.44 } as Price,
        min: { type: 'Money', currency: 'USD', value: 9.45 } as Price,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 8 } as Price,
        p2: { type: 'Money', currency: 'USD', value: 9 } as Price,
        diff: { type: 'Money', currency: 'USD', value: -1 } as Price,
        sum: { type: 'Money', currency: 'USD', value: 17 } as Price,
        min: { type: 'Money', currency: 'USD', value: 8 } as Price,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 8.88888 } as Price,
        p2: { type: 'Money', currency: 'USD', value: 3.55555 } as Price,
        diff: { type: 'Money', currency: 'USD', value: 5.33 } as Price,
        sum: { type: 'Money', currency: 'USD', value: 12.44 } as Price,
        min: { type: 'Money', currency: 'USD', value: 3.56 } as Price,
      },
    ];
  }

  function dataProviderInvalid() {
    return [
      {
        p1: undefined,
        p2: { type: 'Money', currency: 'USD', value: 9 } as Price,
        error: /.*undefined.*/,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 9 } as Price,
        p2: undefined,
        error: /.*undefined.*/,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 9 } as Price,
        p2: { type: 'Money', value: 9 } as Price,
        error: /.*undefined.*/,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 9 } as Price,
        p2: { type: 'Money', currency: 'USD' } as Price,
        error: /.*undefined.*/,
      },
      {
        p1: { type: 'Money', currency: 'USD', value: 10 } as Price,
        p2: { type: 'Money', currency: 'EUR', value: 9 } as Price,
        error: /.*currency.*/,
      },
    ];
  }

  describe('diff', () => {
    using(dataProviderValid, slice => {
      it(`should return ${slice.diff.value} when diff'ing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(PriceHelper.diff(slice.p1, slice.p2)).toEqual(slice.diff);
      });
    });

    using(dataProviderInvalid, slice => {
      it(`should throw something like ${slice.error} when diff'ing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(() => PriceHelper.diff(slice.p1, slice.p2)).toThrowError(slice.error);
      });
    });
  });

  describe('sum', () => {
    using(dataProviderValid, slice => {
      it(`should return ${slice.sum.value} when summing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(PriceHelper.sum(slice.p1, slice.p2)).toEqual(slice.sum);
      });
    });

    using(dataProviderInvalid, slice => {
      it(`should throw something like ${slice.error} when summing '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(() => PriceHelper.sum(slice.p1, slice.p2)).toThrowError(slice.error);
      });
    });
  });

  describe('min', () => {
    using(dataProviderValid, slice => {
      it(`should return ${slice.min.value} when finding minimum of '${JSON.stringify(slice.p1)}' and '${JSON.stringify(
        slice.p2
      )}'`, () => {
        expect(PriceHelper.min(slice.p1, slice.p2)).toEqual(slice.min);
      });
    });

    using(dataProviderInvalid, slice => {
      it(`should throw something like ${slice.error} when finding minimum '${JSON.stringify(
        slice.p1
      )}' and '${JSON.stringify(slice.p2)}'`, () => {
        expect(() => PriceHelper.min(slice.p1, slice.p2)).toThrowError(slice.error);
      });
    });
  });

  describe('invert', () => {
    it('should return inverted price when called', () => {
      const invertedPrice = PriceHelper.invert({ type: 'Money', currency: 'USD', value: 9 } as Price);
      expect(invertedPrice.value).toEqual(-9);
    });

    it('should return inverted price item when called', () => {
      const invertedPrice = PriceHelper.invert({ type: 'PriceItem', currency: 'USD', gross: 9, net: 8 } as PriceItem);
      expect(invertedPrice.gross).toEqual(-9);
      expect(invertedPrice.net).toEqual(-8);
    });
  });
});
