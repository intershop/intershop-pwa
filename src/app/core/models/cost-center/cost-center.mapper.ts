import { Injectable } from '@angular/core';

import { CostCenterData } from './cost-center.interface';
import { CostCenter } from './cost-center.model';

@Injectable({ providedIn: 'root' })
export class CostCenterMapper {
  static fromData(costCenterData: CostCenterData[]): CostCenter[] {
    console.log('123');
    console.log(costCenterData);
    return costCenterData;
  }
}
