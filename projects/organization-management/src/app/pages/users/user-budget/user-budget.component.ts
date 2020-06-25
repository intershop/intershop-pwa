import { Price } from './../../../../../../../src/app/core/models/price/price.model';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { UserBudgets } from 'ish-core/models/user-budgets/user-budgets.model';

@Component({
  selector: 'ish-user-budget',
  templateUrl: './user-budget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserBudgetComponent implements OnInit {
  @Input() budget: UserBudgets;

  usedBudget: Price;

  ngOnInit(): void {
    this.usedBudget = {
      value: this.budget.budget.value - this.budget.remainingBudget.value,
      currency: this.budget.budget.currency,
      type: 'Money',
    };
  }

  usedBudgetPercentage() {
    const usedBudgetCalculation =
      this.budget.budget.value === 0 ? 0 : (this.usedBudget.value / this.budget.budget.value) * 100;

    return usedBudgetCalculation.toString().concat('%');
  }

  remainingBudgetPercentage() {
    const remainingBudgetCalculation =
      this.budget.budget.value === 0 ? 0 : (this.budget.remainingBudget.value / this.budget.budget.value) * 100;

    return remainingBudgetCalculation.toString().concat('%');
  }
}
