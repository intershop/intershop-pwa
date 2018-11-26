import { AddressData } from '../address/address.interface';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

import { BasketData } from './basket.interface';
import { BasketMapper } from './basket.mapper';
import { Basket } from './basket.model';

describe('Basket Mapper', () => {
  describe('fromData', () => {
    let basket: Basket;
    let basketData: BasketData;
    beforeEach(() => {
      basketData = {
        data: {
          id: 'basket_1234',
          calculationState: 'CALCULATED',
          invoiceToAddress: 'urn_invoiceToAddress_123',
          commonShipToAddress: 'urn_commonShipToAddress_123',
          commonShippingMethod: 'shipping_method_123',
          totals: {
            grandTotal: {
              gross: {
                value: 141796.98,
                currency: 'USD',
              },
              net: {
                value: 141796.98,
                currency: 'USD',
              },
              tax: {
                value: 543.65,
                currency: 'USD',
              },
            },
            itemTotal: {
              gross: {
                value: 141796.98,
                currency: 'USD',
              },
              net: {
                value: 141796.98,
                currency: 'USD',
              },
            },
            discountedItemTotal: {
              gross: {
                value: 141796.98,
                currency: 'USD',
              },
              net: {
                value: 141796.98,
                currency: 'USD',
              },
            },
          },

          discounts: {
            valueBasedDiscounts: ['discount_1'],
          },
          surcharges: {
            itemSurcharges: [
              {
                name: 'surcharge',
                amount: {
                  gross: {
                    value: 654.56,
                    currency: 'USD',
                  },
                  net: {
                    value: 647.56,
                    currency: 'USD',
                  },
                },
                description: 'Surcharge for battery deposit',
              },
            ],
          },
        },

        included: {
          invoiceToAddress: {
            urn_invoiceToAddress_123: { id: 'invoiceToAddress_123', urn: 'urn_invoiceToAddress_123' } as AddressData,
          },
          commonShipToAddress: {
            urn_commonShipToAddress_123: {
              id: 'commonShipToAddress_123',
              urn: 'urn_commonShipToAddress_123',
            } as AddressData,
          },
          commonShippingMethod: {
            shipping_method_123: { id: 'shipping_method_123', name: 'ShippingMethodName' } as ShippingMethod,
          },
          discounts: {
            discount_1: {
              id: 'discount_1',
              promotionType: 'OrderValueOffDiscount',
              amount: {
                gross: {
                  currency: 'USD',
                  value: 11.9,
                },
              },
              code: 'INTERSHOP',
              description:
                'For orders over 200 USD, a 10 USD Order discount is guaranteed for the Promo Code "INTERSHOP".',
            },
          },
        },
      } as BasketData;
    });

    it(`should return Basket when getting BasketData without includes`, () => {
      basketData.data.invoiceToAddress = undefined;
      basketData.data.commonShipToAddress = undefined;
      basketData.data.commonShippingMethod = undefined;
      basketData.data.discounts = undefined;

      basket = BasketMapper.fromData(basketData);
      expect(basket).toBeTruthy();

      expect(basket.totals.itemTotal.value).toBe(basketData.data.totals.discountedItemTotal.gross.value);
      expect(basket.totals.itemSurchargeTotalsByType[0].amount.value).toBe(
        basketData.data.surcharges.itemSurcharges[0].amount.gross.value
      );
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should return invoice address if included', () => {
      basketData.data.commonShipToAddress = undefined;
      basketData.data.commonShippingMethod = undefined;
      basketData.data.discounts = undefined;
      basket = BasketMapper.fromData(basketData);

      expect(basket.invoiceToAddress.id).toEqual('invoiceToAddress_123');
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should return common ship to address if included', () => {
      basketData.data.invoiceToAddress = undefined;
      basketData.data.commonShippingMethod = undefined;
      basketData.data.discounts = undefined;
      basket = BasketMapper.fromData(basketData);

      expect(basket.commonShipToAddress.id).toEqual('commonShipToAddress_123');
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should return common shipping method if included', () => {
      basketData.data.invoiceToAddress = undefined;
      basketData.data.commonShipToAddress = undefined;
      basketData.data.discounts = undefined;
      basket = BasketMapper.fromData(basketData);

      expect(basket.commonShippingMethod.name).toEqual('ShippingMethodName');
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should discounts if included', () => {
      basket = BasketMapper.fromData(basketData);

      expect(basket.totals.valueRebates[0].amount.value).toBePositive();
    });

    it('should return estimated as false if invoive address, shipping address and shipping method is set', () => {
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeTrue();
    });
  });
});
