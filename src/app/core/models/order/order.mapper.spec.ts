import { AddressData } from 'ish-core/models/address/address.interface';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { OrderBaseData, OrderData } from './order.interface';
import { OrderMapper } from './order.mapper';

describe('Order Mapper', () => {
  const orderBaseData = {
    documentNumber: '4711',
    creationDate: 0,
    status: 'New',
    statusCode: 'NEW',
    id: 'order_1234',
    invoiceToAddress: 'urn_invoiceToAddress_123',
    commonShipToAddress: 'urn_commonShipToAddress_123',
    commonShippingMethod: 'shipping_method_123',
    lineItems: ['YikKAE8BKC0AAAFrIW8IyLLD'],
    requisitionDocumentNo: '58765',
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
    attributes: [
      { name: 'BusinessObjectAttributes#OrderApproval_ApprovalDate', value: '2020-10-12T13:40:00+02:00', type: 'Date' },
      { name: 'BusinessObjectAttributes#OrderApproval_ApproverFirstName', value: 'Patricia', type: 'String' },
      { name: 'BusinessObjectAttributes#OrderApproval_ApproverLastName', value: 'Miller', type: 'String' },
    ],
  } as OrderBaseData;

  const orderData = {
    data: orderBaseData,
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
        } as OrderItemData,
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
    },
    infos: [
      {
        message: 'infoMessage',
        code: 'infoCode',
      },
    ],
  } as OrderData;

  describe('fromData', () => {
    it(`should return Order when getting OrderData`, () => {
      const order = OrderMapper.fromData(orderData);

      expect(order).toBeTruthy();
      expect(order.id).toEqual(orderBaseData.id);
      expect(order.documentNo).toEqual(orderBaseData.documentNumber);
      expect(order.status).toEqual(orderBaseData.status);
      expect(order.statusCode).toEqual(orderBaseData.statusCode);

      expect(order.invoiceToAddress.urn).toBe('urn_invoiceToAddress_123');
      expect(order.commonShipToAddress.urn).toBe('urn_commonShipToAddress_123');
      expect(order.commonShippingMethod.id).toBe('shipping_method_123');
      expect(order.lineItems).toBeArrayOfSize(1);
      expect(order.infos).toBeArrayOfSize(1);

      expect(order.approval.approverFirstName).toBe('Patricia');
      expect(order.requisitionNo).toBe(orderBaseData.requisitionDocumentNo);
    });
  });
});
