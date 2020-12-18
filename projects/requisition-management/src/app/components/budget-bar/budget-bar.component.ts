import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price } from 'ish-core/models/price/price.model';

/**
 * The budget bar visualizes the current and spent budget of a user. If an additional amount is defined, it will be displayed in addition to the spent  budget.
 *
 * @example
 * <ish-budget-bar
      [budget]=requisition.userBudget?.budget
      [spentBudget]="requisition.userBudget?.spentBudget"
      [additionalAmount]="orderTotal"
   ></ish-budget-bar>
 */

@Component({
  selector: 'ish-budget-bar',
  templateUrl: './budget-bar.component.html',
  styleUrls: ['./budget-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBarComponent implements OnChanges {
  @Input() budget: Price;
  @Input() spentBudget?: Price;
  @Input() additionalAmount?: Price;

  budgetPercentage: number;
  overflowPercentage: number;
  additionalPercentage: number;

  displayClass: string;
  addDisplayClass: string;

  ngOnChanges() {
    this.calculate();
  }

  /**  calculates all displayed prices and percentages */
  private calculate() {
    if (this.budget && this.budget.value) {
      this.budgetPercentage = this.spentBudget?.value ? (this.spentBudget.value / this.budget.value) * 100 : 0;
      this.displayClass = this.getDisplayColor(this.budgetPercentage);

      this.overflowPercentage = this.budgetPercentage > 100 ? (this.budget.value / this.spentBudget.value) * 100 : 0;

      this.additionalPercentage = this.overflowPercentage
        ? (this.additionalAmount?.value / (this.spentBudget.value + this.additionalAmount?.value)) * 100
        : (this.additionalAmount?.value / this.budget.value) * 100;

      this.addDisplayClass = this.getDisplayColor(this.budgetPercentage + this.additionalPercentage);
    }
  }

  private getDisplayColor(percentage: number): string {
    return percentage >= 90 ? 'bg-danger' : percentage >= 70 ? 'bg-warning' : 'bg-success';
  }
}
