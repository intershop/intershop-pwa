import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { BasketBaseData, BasketData } from './basket.interface';
import { BasketMapper } from './basket.mapper';
import { Basket } from './basket.model';

describe('Basket Mapper', () => {
  const basketBaseData: BasketBaseData = {
    id: 'basket_1234',
    calculated: true,
    invoiceToAddress: 'urn_invoiceToAddress_123',
    commonShipToAddress: 'urn_commonShipToAddress_123',
    commonShippingMethod: 'shipping_method_123',
    customer: 'Heimroth',
    lineItems: ['YikKAE8BKC0AAAFrIW8IyLLD'],
    approval: { approvalRequired: true },
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
          name: 'item_surcharge',
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
      bucketSurcharges: [
        {
          name: 'bucket_surcharge',
          amount: {
            gross: {
              value: 64.56,
              currency: 'USD',
            },
            net: {
              value: 61.86,
              currency: 'USD',
            },
          },
          description: 'Bucket Surcharge for hazardous material',
        },
      ],
    },
  };

  const basketIncludedData = {
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
      shipping_method_123: { id: 'shipping_method_123', name: 'ShippingMethodName' } as ShippingMethodData,
    },
    lineItems: {
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
    discounts: {
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
    discounts_promotion: {
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
    let basket: Basket;
    let basketData: BasketData;
    beforeEach(() => {
      basketData = {
        data: { ...basketBaseData },

        included: { ...basketIncludedData },
        infos: [
          {
            message: 'infoMessage',
            code: 'infoCode',
          },
        ],
      } as BasketData;
    });

    it(`should return Basket when getting BasketData without includes`, () => {
      basketData.data.invoiceToAddress = undefined;
      basketData.data.commonShipToAddress = undefined;
      basketData.data.commonShippingMethod = undefined;
      basketData.data.discounts = undefined;

      basket = BasketMapper.fromData(basketData);
      expect(basket).toBeTruthy();

      expect(basket.customerNo).toBe(basketData.data.customer);
      expect(basket.totals.itemTotal.gross).toBe(basketData.data.totals.itemTotal.gross.value);
      expect(basket.totals.itemSurchargeTotalsByType[0].amount.gross).toBe(
        basketData.data.surcharges.itemSurcharges[0].amount.gross.value
      );
      expect(basket.totals.bucketSurchargeTotalsByType[0].amount.gross).toBe(
        basketData.data.surcharges.bucketSurcharges[0].amount.gross.value
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

    it('should return line items if included', () => {
      basket = BasketMapper.fromData(basketData);

      expect(basket.lineItems).toBeArrayOfSize(1);
    });

    it('should return infos if included', () => {
      basket = BasketMapper.fromData(basketData);

      expect(basket.infos).toBeArrayOfSize(1);
    });

    it('should return discounts if included', () => {
      basket = BasketMapper.fromData(basketData);

      expect(basket.totals.valueRebates[0].amount.gross).toBePositive();
    });

    it('should return estimated as false if invoive address, shipping address and shipping method is set', () => {
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeFalse();
    });

    it('should return approval data if approval data are set', () => {
      basket = BasketMapper.fromData(basketData);
      expect(basket.approval.approvalRequired).toBeTrue();
    });
  });

  describe('getTotals', () => {
    let totals: BasketTotal;
    let basketData: BasketData;
    beforeEach(() => {
      basketData = {
        data: { ...basketBaseData },
        included: { ...basketIncludedData },
      };
    });

    it(`should return totals when getting BasketData with totals`, () => {
      totals = BasketMapper.getTotals(basketBaseData);
      expect(totals).toBeTruthy();

      expect(totals.total.gross).toBe(basketData.data.totals.grandTotal.gross.value);
      expect(totals.itemTotal.gross).toBe(basketData.data.totals.itemTotal.gross.value);
      expect(totals.itemSurchargeTotalsByType[0].amount.gross).toBe(
        basketData.data.surcharges.itemSurcharges[0].amount.gross.value
      );
      expect(totals.isEstimated).toBeFalse();
    });

    it(`should return totals when getting BasketData with discounts`, () => {
      totals = BasketMapper.getTotals(basketBaseData, basketIncludedData.discounts);
      expect(totals).toBeTruthy();

      expect(totals.valueRebates[0].amount.gross).toBePositive();
      expect(totals.valueRebates[0].id).toEqual('discount_1');
    });
  });
});
