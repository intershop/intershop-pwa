import { CostCenter } from './cost-center.model';

export class CostCenterHelper {
  static equal(costCenter1: CostCenter, costCenter2: CostCenter): boolean {
    return !!costCenter1 && !!costCenter2 && costCenter1.id === costCenter2.id;
  }
}
