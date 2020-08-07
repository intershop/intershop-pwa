import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { OrderData } from 'ish-core/models/order/order.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import { RequisitionData } from './requisition.interface';
import { Requisition } from './requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  fromData(payload: RequisitionData, orderPayload?: OrderData): Requisition {
    if (!Array.isArray(payload.data)) {
      const { data } = payload;

      /* determine spentBudgetInclusive this order, ToDo: see #IS-30622 */
      let spentBudgetIncludingThisOrder = data.userBudgets?.spentBudget;
      if (data.approvalStatus?.status === 'pending') {
        if (spentBudgetIncludingThisOrder) {
          spentBudgetIncludingThisOrder.value = spentBudgetIncludingThisOrder.value = +data.totals.grandTotal.gross
            .value;
        } else {
          spentBudgetIncludingThisOrder = {
            value: data.totals?.grandTotal?.gross.value,
            currency: data.totals?.grandTotal?.gross.currency,
            type: 'Money',
          };
        }
      }

      if (data) {
        const payloadData = (orderPayload ? orderPayload : payload) as BasketData;
        payloadData.data.calculated = true;
        return {
          ...BasketMapper.fromData(payloadData),
          id: data.id,
          requisitionNo: data.requisitionNo,
          orderNo: data.orderNo,
          creationDate: data.creationDate,
          userBudgets: { ...data.userBudgets, spentBudgetIncludingThisOrder },
          lineItemCount: data.lineItemCount,
          user: data.userInformation,
          approval: data.approvalStatus,
        };
      } else {
        throw new Error(`requisitionData is required`);
      }
    }
  }

  fromListData(payload: RequisitionData): Requisition[] {
    if (Array.isArray(payload.data)) {
      return payload.data.map(data => ({
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
      }));
    }
  }
}
