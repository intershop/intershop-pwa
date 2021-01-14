import { Address } from 'ish-core/models/address/address.model';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Order } from 'ish-core/models/order/order.model';
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
      quantity: { value: 10 },
      productSKU: '4713',
      singleBasePrice: { gross: 3, net: 2, currency: 'USD', type: 'PriceItem' },
      price: { gross: 3, net: 2, currency: 'USD', type: 'PriceItem' },
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

  static getOrder() {
    return {
      id: '4711',
      documentNo: '12345678',
      customerNo: 'OilCorp',
      lineItems: [BasketMockData.getBasketItem()],
      invoiceToAddress: BasketMockData.getAddress(),
      commonShipToAddress: BasketMockData.getAddress(),
      commonShippingMethod: BasketMockData.getShippingMethod(),
      payment: BasketMockData.getPayment(),
      totals: BasketMockData.getTotals(),
    } as Order;
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
      id: 'ISH_CreditCard',
      displayName: 'Credit Card',
      parameters: [
        {
          key: 'IBAN',
          type: 'input',
          templateOptions: {
            type: 'text',
            required: true,
          },
        },
      ],
      paymentInstruments: [
        {
          id: 'instrumentId',
          accountIdentifier: '*******4321',
        },
      ],
      saveAllowed: true,
    } as PaymentMethod;
  }

  static getPayment(): Payment {
    return {
      displayName: 'Invoice',
      paymentInstrument: { id: 'ISH_INVOICE' },
      id: 'open-tender',
      status: 'Unprocessed',
    } as Payment;
  }

  static getTotals(): BasketTotal {
    return {
      itemTotal: {
        gross: 141796.98,
        currency: 'USD',
        type: 'PriceItem',
      },
      itemRebatesTotal: {
        gross: 4446,
        currency: 'USD',
        type: 'PriceItem',
      },
      shippingTotal: {
        gross: 87.06,
        currency: 'USD',
        type: 'PriceItem',
      },
      itemShippingRebatesTotal: {
        gross: 0,
        currency: 'USD',
        type: 'PriceItem',
      },
      valueRebatesTotal: {
        gross: 4457.9,
        currency: 'USD',
        type: 'PriceItem',
      },
      shippingRebatesTotal: {
        gross: 0,
        currency: 'USD',
        type: 'PriceItem',
      },
      paymentCostsTotal: {
        gross: 3.57,
        currency: 'USD',
        type: 'PriceItem',
      },
      taxTotal: {
        value: 22747.55,
        currency: 'USD',
        type: 'Money',
      },
      total: {
        gross: 142470.71,
        net: 13000.0,
        currency: 'USD',
        type: 'PriceItem',
      },
      valueRebates: [
        {
          amount: {
            gross: 11.9,
            currency: 'USD',
            type: 'PriceItem',
          },
          rebateType: 'OrderValueOffDiscount',
        } as BasketRebate,
      ],
      itemSurchargeTotalsByType: [
        {
          amount: {
            gross: 595,
            currency: 'USD',
            type: 'PriceItem',
          },
          description: 'Surcharge for battery deposit',
          displayName: 'Battery Deposit Surcharge',
        },
      ],
      isEstimated: false,
    } as BasketTotal;
  }
}
