import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { PriceItem } from 'ish-core/models/price-item/price-item.interface';
import { getLoggedInCustomer } from 'ish-core/store/user';

import { PriceMapper } from './price.mapper';

describe('Price Mapper', () => {
  let priceMapper: PriceMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: {} }] }), PriceMapper],
    });

    priceMapper = TestBed.get(PriceMapper);
  });

  const priceItem = {
    gross: {
      value: 43.34,
      currency: 'USD',
    },
    net: {
      value: 40.34,
      currency: 'USD',
    },
  } as PriceItem;

  describe('fromData', () => {
    it(`should return gross Price when getting a PriceItem for an anonymous user`, () => {
      const price = priceMapper.fromPriceItem(priceItem);

      expect(price).toBeTruthy();
      expect(price.value).toBe(priceItem.gross.value);
      expect(price.currency).toBe('USD');
    });

    it(`should return net Price when getting a PriceItem with price type 'net'`, () => {
      const price = priceMapper.fromPriceItem(priceItem, 'net');

      expect(price).toBeTruthy();
      expect(price.value).toBe(priceItem.net.value);
    });
  });
});
