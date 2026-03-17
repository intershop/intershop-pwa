import { NgClass, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BudgetInfoComponent } from 'organization-management';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

import { Requisition } from '../../../models/requisition/requisition.model';
import { BudgetBarComponent } from '../budget-bar/budget-bar.component';

/**
 * The buyer approval info box
 *
 */
@Component({
  selector: 'ish-requisition-buyer-approval',
  templateUrl: './requisition-buyer-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    BudgetBarComponent,
    InfoBoxComponent,
    NgClass,
    OrderRecurrenceComponent,
    PercentPipe,
    PricePipe,
    TranslatePipe,
    BudgetInfoComponent],
})
export class RequisitionBuyerApprovalComponent implements OnChanges {
  @Input({ required: true }) requisition: Requisition;

  orderTotal: Price;
  spentPercentage: number;
  spentPercentageIncludingThisRequisition: number;
  leftPercentage: number;

  ngOnChanges() {
    this.calculate();
  }

  /**  calculates all displayed prices and percentages */
  private calculate() {
    if (this.requisition) {
      this.orderTotal = {
        type: 'Money',
        value:
          this.requisition?.userBudget?.budgetPriceType === 'gross'
            ? this.requisition?.totals?.total?.gross
            : this.requisition?.totals?.total?.net,
        currency: this.requisition.totals.total.currency,
      };

      this.spentPercentage =
        this.requisition.userBudget?.spentBudget?.value && this.requisition.userBudget.budget?.value
          ? this.requisition.userBudget.spentBudget.value / this.requisition.userBudget.budget.value
          : 0;
      this.leftPercentage = this.spentPercentage < 1 ? 1 - this.spentPercentage : 0;

      const spentBudgetIncludingThisOrder = this.requisition.userBudget?.spentBudgetIncludingThisRequisition;

      this.spentPercentageIncludingThisRequisition =
        spentBudgetIncludingThisOrder?.value && this.requisition.userBudget?.budget?.value
          ? spentBudgetIncludingThisOrder.value / this.requisition.userBudget?.budget.value
          : 0;
    }
  }
}
