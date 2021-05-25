import { Injectable } from '@angular/core';

import { BuyingContextData } from './buying-context.interface';
import { BuyingContext } from './buying-context.model';

@Injectable({ providedIn: 'root' })
export class BuyingContextMapper {
  static fromData(buyingContextData: BuyingContextData): BuyingContext {
    if (buyingContextData) {
      return {
        groupId: buyingContextData.groupId,
        groupName: buyingContextData.groupName,
        organizationId: buyingContextData.organizationId,
        groupPath: buyingContextData.groupPath,
      };
    } else {
      throw new Error(`buyingContextData is required`);
    }
  }
}
