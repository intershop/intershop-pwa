import { Address } from '../../models/address/address.model';
import { BasketItem } from '../../models/basket-item/basket-item.model';
import { BasketRebate } from '../../models/basket-rebate/basket-rebate.model';
import { Basket } from '../../models/basket/basket.model';
import { ShippingMethod } from '../../models/shipping-method/shipping-method.model';

export class BasketMockData {
  static getBasket(): Basket {
    return {
      id: '4711',
      lineItems: [this.getBasketItem()],
      invoiceToAddress: this.getAddress(),
      commonShipToAddress: this.getAddress(),
      commonShippingMethod: this.getShippingMethod(),
      valueRebates: [
        {
          name: 'appliedRebate',
          amount: {
            value: 11.9,
            currencyMnemonic: 'USD',
          },
          rebateType: 'OrderValueOffDiscount',
        } as BasketRebate,
      ],
      itemSurchargeTotalsByType: [
        {
          name: 'surcharge',
          amount: {
            value: 595,
            currencyMnemonic: 'USD',
          },
          description: 'Surcharge for battery deposit',
          displayName: 'Battery Deposit Surcharge',
        },
      ],

      totals: {
        itemTotal: {
          value: 141796.98,
          currencyMnemonic: 'USD',
        },
        itemRebatesTotal: {
          value: 4446,
          currencyMnemonic: 'USD',
        },
        shippingTotal: {
          value: 87.06,
          currencyMnemonic: 'USD',
        },
        itemShippingRebatesTotal: {
          value: 0,
          currencyMnemonic: 'USD',
        },
        basketValueRebatesTotal: {
          value: 4457.9,
          currencyMnemonic: 'USD',
        },
        basketShippingRebatesTotal: {
          value: 0,
          currencyMnemonic: 'USD',
        },
        paymentCostsTotal: {
          value: 3.57,
          currencyMnemonic: 'USD',
        },
        taxTotal: {
          value: 22747.55,
          currencyMnemonic: 'USD',
        },
        basketTotal: {
          value: 142470.71,
          currencyMnemonic: 'USD',
        },
      },
    } as Basket;
  }

  static getBasketItem(): BasketItem {
    return {
      id: '4712',
      name: 'pli name',
      quantity: { value: 10 },
      productSKU: '4713',
      availability: true,
      inStock: true,
      singleBasePrice: { value: 3, currencyMnemonic: 'USD' },
      price: { value: 3, currencyMnemonic: 'USD' },
      totals: {},
    } as BasketItem;
  }

  static getAddress(): Address {
    return {
      urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:ilMKAE8BlIUAAAFgEdAd1LZU',
      id: 'ilMKAE8BlIUAAAFgEdAd1LZU',
      addressName: 'customeraddr-ABCDEFGPRMuMCscyXgSRVU',
      title: 'Ms.',
      firstName: 'Patricia',
      lastName: 'Miller',
      addressLine1: 'Potsdamer Str. 20',
      postalCode: '14483',
      phoneHome: '049364112677',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Berlin',
      usage: [true, true],
      shipToAddress: true,
      invoiceToAddress: true,
      shipFromAddress: false,
    } as Address;
  }

  static getShippingMethod(): ShippingMethod {
    return {
      name: 'Standard Ground',
      shippingTimeMin: 3,
      shippingTimeMax: 7,
    } as ShippingMethod;
  }
}
