import { Address } from 'ish-core/models/address/address.model';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderView } from 'ish-core/models/order/order.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

export class BasketMockData {
  static getBasket(): BasketView {
    return {
      id: '4711',
      lineItems: [BasketMockData.getBasketItem()],
      invoiceToAddress: BasketMockData.getAddress(),
      commonShipToAddress: BasketMockData.getAddress(),
      commonShippingMethod: BasketMockData.getShippingMethod(),
      payment: BasketMockData.getPayment(),
      totals: BasketMockData.getTotals(),
    } as BasketView;
  }

  static getBasketItem(): LineItemView {
    return {
      id: '4712',
      name: 'pli name',
      quantity: { value: 10 },
      productSKU: '4713',
      product: { sku: '4713', availability: true, inStock: true },
      singleBasePrice: { value: 3, currencyMnemonic: 'USD' },
      price: { value: 3, currencyMnemonic: 'USD' },
      itemSurcharges: [
        {
          amount: {},
          description: 'test',
          displayName: 'test',
        },
      ],
      totals: {},
    } as LineItemView;
  }

  static getOrder(): OrderView {
    return {
      id: '4711',
      documentNo: '12345678',
      lineItems: [BasketMockData.getBasketItem()],
      invoiceToAddress: BasketMockData.getAddress(),
      commonShipToAddress: BasketMockData.getAddress(),
      commonShippingMethod: BasketMockData.getShippingMethod(),
      payment: BasketMockData.getPayment(),
      totals: BasketMockData.getTotals(),
    } as OrderView;
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
      email: 'patricia@test.intershop.de',
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

  static getPaymentMethod(): PaymentMethod {
    return {
      name: 'Invoice',
      type: 'Payment',
      id: '4711',
    } as PaymentMethod;
  }

  static getPayment(): Payment {
    return {
      name: 'INVOiCE',
      displayName: 'Invoice',
      type: 'Payment',
      id: '4711',
      status: 'Unprocessed',
    } as Payment;
  }

  static getTotals(): BasketTotal {
    return {
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
      valueRebatesTotal: {
        value: 4457.9,
        currencyMnemonic: 'USD',
      },
      shippingRebatesTotal: {
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
      total: {
        value: 142470.71,
        currencyMnemonic: 'USD',
      },
      valueRebates: [
        {
          amount: {
            value: 11.9,
            currencyMnemonic: 'USD',
          },
          rebateType: 'OrderValueOffDiscount',
        } as BasketRebate,
      ],
      itemSurchargeTotalsByType: [
        {
          amount: {
            value: 595,
            currencyMnemonic: 'USD',
          },
          description: 'Surcharge for battery deposit',
          displayName: 'Battery Deposit Surcharge',
        },
      ],
      isEstimated: false,
    } as BasketTotal;
  }
}
