import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price } from 'ish-core/models/price/price.model';

import { Requisition } from '../../../models/requisition/requisition.model';

/**
 * The buyer approval info box
 *
 */
@Component({
  selector: 'ish-requisition-buyer-approval',
  templateUrl: './requisition-buyer-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionBuyerApprovalComponent implements OnChanges {
  @Input() requisition: Requisition;

  orderTotal: Price;
  spentPercentage: number;
  spentBudgetIncludingThisOrder: Price;
  spentPercentageIncludingThisOrder: number;
  leftBudget: Price;
  leftPercentage: number;

  ngOnChanges() {
    this.calculate();
  }

  /**  calculates all displayed prices and percentages */
  private calculate() {
    if (this.requisition) {
      this.orderTotal = {
        type: 'Money',
        value: this.requisition.totals.total.gross,
        currency: this.requisition.totals.total.currency,
      };

      this.spentPercentage = this.requisition.userBudgets?.spentBudget?.value
        ? this.requisition.userBudgets.spentBudget.value / this.requisition.userBudgets.budget.value
        : 0;

      this.spentBudgetIncludingThisOrder = {
        type: 'Money',
        currency: this.requisition.totals.total.currency,
        value: this.requisition.userBudgets?.spentBudget?.value + this.requisition.totals.total.gross,
      };

      this.spentPercentageIncludingThisOrder =
        this.spentBudgetIncludingThisOrder.value && this.requisition.userBudgets?.budget?.value
          ? this.spentBudgetIncludingThisOrder.value / this.requisition.userBudgets?.budget.value
          : 0;

      this.leftBudget = {
        type: 'Money',
        currency: this.requisition.totals.total.currency,
        value:
          this.spentPercentage < 1
            ? this.requisition.userBudgets?.budget?.value - this.requisition.userBudgets?.spentBudget?.value
            : 0,
      };
      this.leftPercentage = this.spentPercentage < 1 ? 1 - this.spentPercentage : 0;
    }
  }
}
