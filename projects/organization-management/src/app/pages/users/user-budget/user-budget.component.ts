import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price, PriceHelper } from 'ish-core/models/price/price.model';

import { UserBudgets } from '../../../models/user-budgets/user-budgets.model';

/**
 * displays the user budget and the appropriate budget bar
 */
@Component({
  selector: 'ish-user-budget',
  templateUrl: './user-budget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserBudgetComponent implements OnChanges {
  @Input() budget: UserBudgets;

  usedBudget: Price;
  usedBudgetPercentage: number;
  remainingBudgetPercentage: number;

  ngOnChanges(): void {
    if (this.budgetsDefined) {
      this.calculate();
    }
  }

  get budgetsDefined(): boolean {
    return !!this.budget?.budget && !!this.budget?.remainingBudget;
  }

  private calculate() {
    this.usedBudget = PriceHelper.diff(this.budget.budget, this.budget.remainingBudget);
    this.usedBudgetPercentage = this.budget.budget.value === 0 ? 0 : this.usedBudget.value / this.budget.budget.value;
    this.remainingBudgetPercentage =
      this.budget.budget.value === 0 ? 0 : this.budget.remainingBudget.value / this.budget.budget.value;
  }
}
