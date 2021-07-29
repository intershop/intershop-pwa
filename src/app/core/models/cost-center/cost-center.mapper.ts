import { Injectable } from '@angular/core';

import { CostCenterData } from './cost-center.interface';
import { CostCenter } from './cost-center.model';

@Injectable({ providedIn: 'root' })
export class CostCenterMapper {
  fromData(costCenterData: CostCenterData): CostCenter {
    if (costCenterData) {
      return {
        id: costCenterData.incomingField,
      };
    } else {
      throw new Error(`costCenterData is required`);
    }
  }
}
