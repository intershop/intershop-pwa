import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { OrderData } from 'ish-core/models/order/order.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { Price } from 'ish-core/models/price/price.model';

import { RequisitionData } from './requisition.interface';
import { Requisition } from './requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  fromData(payload: RequisitionData, orderPayload?: OrderData): Requisition {
    if (!Array.isArray(payload.data)) {
      const { data } = payload;
      const emptyPrice: Price = {
        type: 'Money',
        value: 0,
        currency: data.userBudgets?.budget?.currency,
      };

      if (data) {
        const payloadData = (orderPayload ? orderPayload : payload) as BasketData;
        payloadData.data.calculated = true;

        return {
          ...BasketMapper.fromData(payloadData),
          id: data.id,
          requisitionNo: data.requisitionNo,
          orderNo: data.orderNo,
          creationDate: data.creationDate,
          userBudget: { ...data.userBudgets, spentBudget: data.userBudgets?.spentBudget || emptyPrice },
          lineItemCount: data.lineItemCount,
          user: data.userInformation,
          approval: {
            ...data.approvalStatus,
            customerApprovers: data.approval?.customerApproval?.approvers,
          },
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
          .filter(data => data.requisitionNo)
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
}
