import { Injectable } from '@angular/core';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { CustomFieldMapper } from 'ish-core/models/custom-field/custom-field.mapper';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { PaymentMapper } from 'ish-core/models/payment/payment.mapper';

import { RecurringOrderData, RecurringOrderListData } from './recurring-order.interface';
import { RecurringOrder } from './recurring-order.model';

@Injectable({ providedIn: 'root' })
export class RecurringOrderMapper {
  static fromListData(recurringOrdersData: RecurringOrderListData[]): RecurringOrder[] {
    if (!recurringOrdersData.length) {
      return [];
    }
    return recurringOrdersData.map(data => ({
      id: data.id,
      documentNo: data.number,
      active: data.active,
      expired: data.expired,

      recurrence: {
        interval: data.interval,
        startDate: data.startDate,
        endDate: data.endDate,
        repetitions: data.repetitions,
      },

      creationDate: data.creationDate,
      lastOrderDate: data.lastOrderDate,
      nextOrderDate: data.nextOrderDate,

      customerNo: data.buyer?.customerNo,
      email: data.buyer?.email,
      user: {
        email: data.buyer?.email,
        firstName: data.buyer?.firstName,
        lastName: data.buyer?.lastName,
        companyName: data.buyer?.companyName,
      },

      totals: {
        total: {
          type: 'PriceItem',
          gross: data.totalGross.amount,
          net: data.totalNet.amount,
          currency: data.totalGross.currency,
        },
        // required properties for 'totals'
        itemTotal: undefined,
        isEstimated: false,
      },
    }));
  }

  static fromData(payload: RecurringOrderData): RecurringOrder {
    const { data, included } = payload;

    if (!data) {
      return;
    }

    return {
      id: data.id,
      documentNo: data.number,
      active: data.active,
      expired: data.expired,
      error: data.error,
      errorCode: data.errorCode,
      statusCode: data.statusCode,

      recurrence: {
        interval: data.interval,
        startDate: data.startDate,
        endDate: data.endDate,
        repetitions: data.repetitions,
      },

      creationDate: data.creationDate,
      lastOrderDate: data.lastOrderDate,
      nextOrderDate: data.nextOrderDate,
      orderCount: data.orderCount,
      costCenter: data.costCenterID,
      costCenterName: data.costCenterName,

      customerNo: data.buyer?.customerNo,
      email: data.buyer?.email,
      user: {
        email: data.buyer?.email,
        firstName: data.buyer?.firstName,
        lastName: data.buyer?.lastName,
        companyName: data.buyer?.companyName,
      },

      invoiceToAddress: data.addresses?.find(address => address.urn === data.invoiceToAddress),
      commonShipToAddress: data.addresses?.find(address => address.urn === data.shippingBuckets?.[0]?.shipToAddress),
      commonShippingMethod: data.shippingMethods?.find(
        methods => methods.id === data.shippingBuckets?.[0]?.shippingMethod
      ),

      payment: data.payments?.length
        ? PaymentMapper.fromIncludeData(data.payments[0], data.paymentMethods[0], undefined)
        : undefined,

      approvalStatuses: data.approvalStatuses
        ?.map(status => ({
          approvalDate: status.approvalDate,
          approver: status.approver,
          statusCode: status.statusCode,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.approvalDate === value.approvalDate &&
                t.approver.firstName === value.approver.firstName &&
                t.approver.lastName === value.approver.lastName
            )
        ),

      lastPlacedOrders: data.lastOrders,

      lineItems: data.lineItems?.length
        ? data.lineItems.map(lineItem =>
            LineItemMapper.fromData(lineItem, included?.lineItems_discounts, included?.lineItems_warranty)
          )
        : [],

      customFields: CustomFieldMapper.fromData(data.customFields),
      totals: BasketMapper.getTotals(data as unknown as BasketBaseData, included ? included.discounts : undefined),
    };
  }
}
