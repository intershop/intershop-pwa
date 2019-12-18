import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { BasketValidationData } from './basket-validation.interface';
import { BasketValidationMapper } from './basket-validation.mapper';
import { BasketValidation } from './basket-validation.model';

describe('Basket Validation Mapper', () => {
  const basketBaseData: BasketBaseData = {
    id: 'basket_1234',
    calculated: true,
    invoiceToAddress: 'urn_invoiceToAddress_123',
    commonShipToAddress: 'urn_commonShipToAddress_123',
    commonShippingMethod: 'shipping_method_123',
    lineItems: ['YikKAE8BKC0AAAFrIW8IyLLD'],
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
    } as BasketTotalData,
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
  };

  const basketIncludedData = {
    basket: { [basketBaseData.id]: basketBaseData },
    basket_invoiceToAddress: {
      urn_invoiceToAddress_123: { id: 'invoiceToAddress_123', urn: 'urn_invoiceToAddress_123' } as AddressData,
    },
    basket_commonShipToAddress: {
      urn_commonShipToAddress_123: {
        id: 'commonShipToAddress_123',
        urn: 'urn_commonShipToAddress_123',
      } as AddressData,
    },
    basket_commonShippingMethod: {
      shipping_method_123: { id: 'shipping_method_123', name: 'ShippingMethodName' } as ShippingMethodData,
    },
    basket_lineItems: {
      YikKAE8BKC0AAAFrIW8IyLLD: {
        id: '382478392',
        calculated: false,
        position: 1,
        freeGift: false,
        hiddenGift: false,
        quantity: { value: 4 },
        product: '8182790134363',
      } as LineItemData,
    },
    basket_discounts: {
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
        description: 'For orders over 200 USD, a 10 USD Order discount is guaranteed for the Promo Code "INTERSHOP".',
        promotion: 'FreeShippingOnLEDTVs',
      },
    },
    basket_discounts_promotion: {
      FreeShippingOnLEDTVs: {
        id: 'FreeShippingOnLEDTVs',
        couponCodeRequired: false,
        currency: 'USD',
        description: 'For LED TVs the shipping is free.',
        externalUrl: 'URL',
        icon: 'ICON',
        legalContentMessage: 'Legal Content Message',
        name: 'Free Shipping on LED TVs',
        promotionType: 'ShippingPercentageOffDiscount',
        ruleDescription: 'Buy any LED TV and the order ships free.',
        title: 'FREE SHIPPING',
        useExternalUrl: true,
        disableMessages: false,
      },
    },
  };

  describe('fromData', () => {
    let basketValidation: BasketValidation;
    let basketValidationData: BasketValidationData;
    beforeEach(() => {
      basketValidationData = {
        data: {
          scopes: ['Shipping'],
          basket: basketBaseData.id,
          results: {
            valid: false,
            adjusted: false,
            errors: [
              {
                message: 'error',
                code: '4711',
              },
            ],
            infos: [
              {
                message: 'info',
                code: '4712',
              },
            ],
          },
        },

        included: { ...basketIncludedData },
      } as BasketValidationData;
    });

    it(`should return Basket Validation results when getting BasketValidationData`, () => {
      basketValidation = BasketValidationMapper.fromData(basketValidationData);
      expect(basketValidation).toBeTruthy();
      expect(basketValidation.results).toBeTruthy();
      expect(basketValidation.results.valid).toBeFalse();
      expect(basketValidation.results.adjusted).toBeFalse();
      expect(basketValidation.results.errors[0].message).toEqual('error');
      expect(basketValidation.results.infos[0].message).toEqual('info');
      expect((basketValidation.scopes[0] = 'Shipping'));
    });

    it('should return (adjusted) Basket when basket was included', () => {
      basketValidation = BasketValidationMapper.fromData(basketValidationData);

      expect(basketValidation.basket.invoiceToAddress.id).toEqual('invoiceToAddress_123');
      expect(basketValidation.basket.commonShipToAddress.id).toEqual('commonShipToAddress_123');
      expect(basketValidation.basket.commonShippingMethod.name).toEqual('ShippingMethodName');
      expect(basketValidation.basket).toBeTruthy();
    });
  });
});
