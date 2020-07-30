import { Injectable } from '@angular/core';

import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import { RequisitionData } from './requisition.interface';
import { Requisition } from './requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  fromData(requisitionData: RequisitionData): Requisition {
    // TODO: remove debug code
    // tslint:disable-next-line: no-console
    console.log('RequisitionData', requisitionData);

    if (requisitionData) {
      return {
        id: requisitionData.id,
        requisitionNo: requisitionData.requisitionNo,
        orderNo: requisitionData.orderNo,
        creationDate: requisitionData.creationDate,
        lineItemCount: requisitionData.lineItemCount,
        totals: {
          itemTotal: requisitionData.totals
            ? PriceItemMapper.fromPriceItem(requisitionData.totals.itemTotal)
            : undefined,
          total: requisitionData.totals
            ? PriceItemMapper.fromPriceItem(requisitionData.totals.grandTotal)
            : {
                type: 'PriceItem',
                gross: requisitionData.totalGross.value,
                net: requisitionData.totalNet.value,
                currency: requisitionData.totalGross.currency,
              },
          isEstimated: false,
        },
        user: requisitionData.userInformation,
        approval: requisitionData.approvalStatus,
      };
    } else {
      throw new Error(`requisitionData is required`);
    }
  }
}
