import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';

@Component({
  selector: 'ish-cost-center-budget',
  templateUrl: './cost-center-budget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterBudgetComponent implements OnChanges {
  @Input() costCenter: CostCenter;
  @Input() progressBarClass: string;

  spentBudgetPercentage: number;
  remainingBudgetPercentage: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.costCenter) {
      this.calculate();
    }
  }

  calculate() {
    if (this.costCenter) {
      this.spentBudgetPercentage =
        this.costCenter.budget.value === 0 ? 0 : this.costCenter.spentBudget?.value / this.costCenter.budget.value;
      this.remainingBudgetPercentage =
        this.costCenter.budget.value === 0 ? 0 : this.costCenter.remainingBudget.value / this.costCenter.budget.value;
    }
  }

  get progressBarWidth() {
    return Math.min(this.spentBudgetPercentage, 1);
  }
}
