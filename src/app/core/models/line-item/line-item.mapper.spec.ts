import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { getLoggedInCustomer } from 'ish-core/store/user';

import { LineItemData } from './line-item.interface';
import { LineItemMapper } from './line-item.mapper';

describe('Line Item Mapper', () => {
  let lineItemMapper: LineItemMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: {} }] }), LineItemMapper],
    });

    lineItemMapper = TestBed.get(LineItemMapper);
  });

  describe('fromData', () => {
    it(`should return BasketItem when getting LineItemData`, () => {
      const lineItemData = {
        id: 'lineItemId',
        product: 'sku_123',
        quantity: {
          value: 3,
        },
        pricing: {
          price: {
            gross: {
              currency: 'USD',
              value: 11.9,
            },
            net: {
              value: 10.56,
              currency: 'USD',
            },
          },
        },
      } as LineItemData;
      const lineItem = lineItemMapper.fromData(lineItemData, undefined);

      expect(lineItem).toBeTruthy();
      expect(lineItem.productSKU).toBe(lineItemData.product);
      expect(lineItem.quantity.value).toBe(3);
    });

    it(`should throw an error when getting no LineItemData`, () => {
      expect(() => lineItemMapper.fromData(undefined, undefined)).toThrow();
    });
  });

  describe('fromOrderItemData', () => {
    it(`should return BasketItem when getting OrderItemData with a product.sku reference`, () => {
      const orderItemData = {
        id: 'orderItemId',
        product: 'SKU',
        quantity: {
          value: 3,
        },
        pricing: {
          price: {
            gross: {
              currency: 'USD',
              value: 11.9,
            },
            net: {
              value: 10.56,
              currency: 'USD',
            },
          },
        },
      } as OrderItemData;
      const basketItem = lineItemMapper.fromOrderItemData(orderItemData, undefined);

      expect(basketItem).toBeTruthy();
      expect(basketItem.productSKU).toBe(orderItemData.product);
      expect(basketItem.quantity.value).toBe(3);
    });

    it(`should throw an error when getting no OrderItemData`, () => {
      expect(() => lineItemMapper.fromOrderItemData(undefined)).toThrow();
    });
  });
});
