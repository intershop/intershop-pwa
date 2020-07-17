import { Injectable } from '@angular/core';

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
        user: requisitionData.user,
        approvalStatus: requisitionData.approvalStatus.status,
      };
    } else {
      throw new Error(`requisitionData is required`);
    }
  }
}
