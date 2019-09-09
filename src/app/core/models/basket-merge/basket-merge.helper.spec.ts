import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketBaseData, BasketData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { BasketMergeHelper } from './basket-merge.helper';
import { BasketMergeData } from './basket-merge.interface';

describe('Basket Merge Helper', () => {
  describe('transform data', () => {
    let transformedBasket: BasketData;

    const basketMergeData = {
      data: {
        targetBasket: 'basket_1234',
        sourceBasket: 'basket_4321',
      },

      included: {
        targetBasket: {
          basket_1234: {
            id: 'basket_1234',
            calculated: true,
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
            },
            lineItems: ['itemID'],
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
          } as BasketBaseData,
        },
        targetBasket_invoiceToAddress: {
          urn_invoiceToAddress_123: { id: 'invoiceToAddress_123', urn: 'urn_invoiceToAddress_123' } as AddressData,
        },
        targetBasket_commonShipToAddress: {
          urn_commonShipToAddress_123: {
            id: 'commonShipToAddress_123',
            urn: 'urn_commonShipToAddress_123',
          } as AddressData,
        },
        targetBasket_commonShippingMethod: {
          shipping_method_123: { id: 'shipping_method_123', name: 'ShippingMethodName' } as ShippingMethodData,
        },
        targetBasket_discounts: {
          discount_1: {
            id: 'discount_1',
            promotionType: 'OrderValueOffDiscount',
            amount: {
              gross: {
                currency: 'USD',
                value: 11.9,
              },
              net: {
                value: 10.56,
                currency: 'USD',
              },
            },
            code: 'INTERSHOP',
            description:
              'For orders over 200 USD, a 10 USD Order discount is guaranteed for the Promo Code "INTERSHOP".',
            promotion: 'FreeShippingOnLEDTVs',
          },
        },
        targetBasket_lineItems: {
          itemID: {
            id: 'itemID',
            calculated: true,
            position: 1,
            quantity: { value: 1 },
            product: 'LMAA',
            pricing: {
              shippingTotal: {
                gross: {
                  currency: 'USD',
                  value: 11.9,
                },
                net: {
                  currency: 'USD',
                  value: 10.56,
                },
              },
              total: {
                gross: {
                  currency: 'USD',
                  value: 11.9,
                },
                net: {
                  currency: 'USD',
                  value: 10.56,
                },
              },
              price: {
                gross: {
                  currency: 'USD',
                  value: 11.9,
                },
                net: {
                  currency: 'USD',
                  value: 10.56,
                },
              },
              singleBasePrice: {
                gross: {
                  currency: 'USD',
                  value: 11.9,
                },
                net: {
                  currency: 'USD',
                  value: 10.56,
                },
              },
            },
            hiddenGift: false,
            freeGift: true,
          } as LineItemData,
        },
      },
    } as BasketMergeData;
    const basketMergeDataWithoutIncluded = {
      data: {
        targetBasket: 'basket_1234',
        sourceBasket: 'basket_4321',
      },
    } as BasketMergeData;
    it('should always transform data without basket includes', () => {
      transformedBasket = BasketMergeHelper.transform(basketMergeDataWithoutIncluded);
      expect(transformedBasket.data).toBeUndefined();
      expect(transformedBasket.included).toBeUndefined();
    });

    it('should always transform data with basket includes', () => {
      transformedBasket = BasketMergeHelper.transform(basketMergeData);
      expect(transformedBasket.data).toEqual(basketMergeData.included.targetBasket[basketMergeData.data.targetBasket]);
      expect(transformedBasket.included.lineItems.itemID).toEqual(
        basketMergeData.included.targetBasket_lineItems[transformedBasket.data.lineItems[0]]
      );
      expect(transformedBasket.included.commonShipToAddress).toEqual(
        basketMergeData.included.targetBasket_commonShipToAddress
      );
      expect(transformedBasket.included.invoiceToAddress).toEqual(
        basketMergeData.included.targetBasket_invoiceToAddress
      );
      expect(transformedBasket.included.commonShippingMethod).toEqual(
        basketMergeData.included.targetBasket_commonShippingMethod
      );
      expect(transformedBasket.included.discounts).toEqual(basketMergeData.included.targetBasket_discounts);
    });
  });
});
