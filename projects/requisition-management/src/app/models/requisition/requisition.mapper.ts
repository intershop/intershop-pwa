import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { OrderData } from 'ish-core/models/order/order.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { Price } from 'ish-core/models/price/price.model';

import { RequisitionData } from './requisition.interface';
import { Requisition, RequisitionUserBudget } from './requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  fromData(payload: RequisitionData, orderPayload?: OrderData): Requisition {
    if (!Array.isArray(payload.data)) {
      const { data } = payload;

      if (data) {
        const payloadData = (orderPayload ? orderPayload : payload) as BasketData;
        payloadData.data.calculated = true;

        return {
          ...BasketMapper.fromData(payloadData),
          id: data.id,
          requisitionNo: data.requisitionNo,
          orderNo: data.orderNo,
          recurringOrderDocumentNo: data.recurringOrderDocumentNo,
          creationDate: data.creationDate,
          userBudget: this.fromUserBudgets(data.userBudgets, data.purchaseCurrency),
          lineItemCount: data.lineItemCount,
          user: data.userInformation,
          approval: {
            ...data.approvalStatus,
            approvers: data.approvalStatuses?.map(status => status.approver),
            customerApproval: {
              ...data.approval?.customerApproval,
              statusCode:
                data.approvalStatuses?.length &&
                data.approval?.customerApproval?.approvers?.some(
                  appr => appr.email === data.approvalStatuses[0]?.approver.email
                )
                  ? data.approvalStatuses[0].statusCode
                  : 'PENDING',
            },
            costCenterApproval: {
              ...data.approval?.costCenterApproval,
              statusCode:
                data.approvalStatuses?.length &&
                data.approval?.costCenterApproval?.approvers[0].email === data.approvalStatuses[0]?.approver.email
                  ? data.approvalStatuses[0].statusCode
                  : 'PENDING',
            },
          },
          systemRejected: data.systemRejected,
          systemRejectErrors: data.systemRejectErrors?.map(error => error.message || error.code),
        };
      } else {
        throw new Error(`requisitionData is required`);
      }
    }
  }

  fromListData(payload: RequisitionData): Requisition[] {
    if (Array.isArray(payload.data)) {
      return (
        payload.data
          /* filter requisitions that didn't need an approval */
          .filter(data => data.requisitionNo || data.recurringOrderDocumentNo)
          .map(data => ({
            ...this.fromData({ ...payload, data }),
            totals: {
              itemTotal: data.totals ? PriceItemMapper.fromPriceItem(data.totals.itemTotal) : undefined,
              total: data.totals
                ? PriceItemMapper.fromPriceItem(data.totals.grandTotal)
                : {
                    type: 'PriceItem',
                    gross: data.totalGross.value,
                    net: data.totalNet.value,
                    currency: data.totalGross.currency,
                  },
              isEstimated: false,
            },
          }))
      );
    }
  }

  private fromUserBudgets(userBudgets: RequisitionUserBudget, purchaseCurrency: string): RequisitionUserBudget {
    if (!userBudgets?.budgetPeriod) {
      return;
    }
    const emptyPrice: Price = {
      type: 'Money',
      value: 0,
      currency: purchaseCurrency,
    };
    return { ...userBudgets, spentBudget: userBudgets.spentBudget || emptyPrice };
  }
}
