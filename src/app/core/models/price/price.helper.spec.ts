import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price, PriceHelper } from './price.model';

describe('Price Helper', () => {
  const dataProviderInvalid = [
    [/.*undefined.*/, undefined, { type: 'Money', currency: 'USD', value: 9 }],
    [/.*undefined.*/, { type: 'Money', currency: 'USD', value: 9 }, undefined],
    [/.*undefined.*/, { type: 'Money', currency: 'USD', value: 9 }, { type: 'Money', value: 9 }],
    [/.*undefined.*/, { type: 'Money', currency: 'USD', value: 9 }, { type: 'Money', currency: 'USD' }],
    [/.*currency.*/, { type: 'Money', currency: 'USD', value: 10 }, { type: 'Money', currency: 'EUR', value: 9 }],
  ];

  describe('diff', () => {
    it.each([
      [
        { type: 'Money', currency: 'USD', value: 1 },
        { type: 'Money', currency: 'USD', value: 10 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],

      [
        { type: 'Money', currency: 'USD', value: 1.54 },
        { type: 'Money', currency: 'USD', value: 10.99 },
        { type: 'Money', currency: 'USD', value: 9.45 },
      ],
      [
        { type: 'Money', currency: 'USD', value: -1 },
        { type: 'Money', currency: 'USD', value: 8 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 5.33 },
        { type: 'Money', currency: 'USD', value: 8.88888 },
        { type: 'Money', currency: 'USD', value: 3.55555 },
      ],
    ])(`should return %j when diff'ing '%j' and '%j'`, (diff, p1: Price, p2: Price) => {
      expect(PriceHelper.diff(p1, p2)).toEqual(diff);
    });

    it.each(dataProviderInvalid)(
      `should throw something like %s when diff'ing '%j' and '%j'`,
      (error: RegExp, p1: Price, p2: Price) => {
        expect(() => PriceHelper.diff(p1, p2)).toThrowError(error);
      }
    );
  });

  describe('sum', () => {
    it.each([
      [
        { type: 'Money', currency: 'USD', value: 19 },
        { type: 'Money', currency: 'USD', value: 10 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 20.44 },
        { type: 'Money', currency: 'USD', value: 10.99 },
        { type: 'Money', currency: 'USD', value: 9.45 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 17 },
        { type: 'Money', currency: 'USD', value: 8 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 12.44 },
        { type: 'Money', currency: 'USD', value: 8.88888 },
        { type: 'Money', currency: 'USD', value: 3.55555 },
      ],
    ])(`should return %j when summing '%j' and '%j'`, (sum, p1: Price, p2: Price) => {
      expect(PriceHelper.sum(p1, p2)).toEqual(sum);
    });

    it.each(dataProviderInvalid)(
      `should throw something like %s when summing '%j' and '%j'`,
      (error: RegExp, p1: Price, p2: Price) => {
        expect(() => PriceHelper.sum(p1, p2)).toThrowError(error);
      }
    );
  });

  describe('min', () => {
    it.each([
      [
        { type: 'Money', currency: 'USD', value: 9 },
        { type: 'Money', currency: 'USD', value: 10 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 9.45 },
        { type: 'Money', currency: 'USD', value: 10.99 },
        { type: 'Money', currency: 'USD', value: 9.45 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 8 },
        { type: 'Money', currency: 'USD', value: 8 },
        { type: 'Money', currency: 'USD', value: 9 },
      ],
      [
        { type: 'Money', currency: 'USD', value: 3.56 },
        { type: 'Money', currency: 'USD', value: 8.88888 },
        { type: 'Money', currency: 'USD', value: 3.55555 },
      ],
    ])(`should return %j when finding minimum of '%j' and '%j'`, (min, p1: Price, p2: Price) => {
      expect(PriceHelper.min(p1, p2)).toEqual(min);
    });

    it.each(dataProviderInvalid)(
      `should throw something like %s when finding minimum '%j' and '%j'`,
      (error: RegExp, p1: Price, p2: Price) => {
        expect(() => PriceHelper.min(p1, p2)).toThrowError(error);
      }
    );
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

  describe('empty', () => {
    it('should always return an empty price with the right currency', () => {
      const emptyPrice = PriceHelper.empty('USD');
      expect(emptyPrice.currency).toEqual('USD');
      expect(emptyPrice.value).toEqual(0);
    });
  });
});

describe('Price Helper', () => {
  let prices: Price[];

  beforeEach(() => {
    expect.addSnapshotSerializer({
      test: (x: Price) => x?.type === 'Money',
      print: (x: Price) => `${x.currency} ${x.value?.toFixed(2)}`,
    });

    prices = [
      { type: 'Money', currency: 'USD', value: 1 },
      { type: 'Money', currency: 'USD', value: 2 },
      { type: 'Money', currency: 'USD', value: 3 },
      { type: 'Money', currency: 'USD', value: 4 },
    ];
  });

  it('should always calculate min with just pairwise method', () => {
    expect(prices.reduce(PriceHelper.min)).toEqual(prices[0]);

    expect(prices.reduce(PriceHelper.min)).toMatchInlineSnapshot(`USD 1.00`);
  });

  it('should always calculate sum with just pairwise method', () => {
    expect(prices.reduce(PriceHelper.sum)).toMatchInlineSnapshot(`USD 10.00`);
  });
});
