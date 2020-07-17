import { Injectable } from '@angular/core';

import { RequisitionData } from './requisition.interface';
import { Requisition } from './requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  fromData(requisitionData: RequisitionData): Requisition {
    if (requisitionData) {
      return {
        id: requisitionData.incomingField,
      };
    } else {
      throw new Error(`requisitionData is required`);
    }
  }
}
