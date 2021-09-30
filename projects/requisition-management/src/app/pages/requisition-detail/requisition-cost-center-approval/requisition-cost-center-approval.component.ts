import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CostCenter, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';

import { Requisition } from '../../../models/requisition/requisition.model';

interface BudgetValues {
  budgetLabel: string;
  spentPercentage: number;
  spentBudgetIncludingThisRequisition: Price;
  spentPercentageIncludingThisRequisition: number;
}

@Component({
  selector: 'ish-requisition-cost-center-approval',
  templateUrl: './requisition-cost-center-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionCostCenterApprovalComponent implements OnInit, OnChanges {
  @Input() requisition: Requisition;

  costCenter: CostCenter;
  approverEmail: string;
  orderTotal: Price;
  buyer: CostCenterBuyer;

  ccVal: BudgetValues;
  bVal: BudgetValues; // buyer budget values

  userEmail$: Observable<string>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.userEmail$ = this.accountFacade.userEmail$;
  }

  ngOnChanges() {
    this.costCenter = this.requisition?.approval?.costCenterApproval?.costCenter;

    this.approverEmail = this.requisition?.approval?.costCenterApproval?.approvers?.length
      ? this.requisition.approval.costCenterApproval.approvers[0].email
      : undefined;

    this.orderTotal = {
      type: 'Money',
      value: this.requisition?.totals?.total?.gross,
      currency: this.requisition?.totals?.total?.currency,
    };

    if (this.costCenter) {
      this.ccVal = this.determineBudgetValues(this.costCenter);

      this.buyer = this.costCenter.buyers?.find(buyer => buyer.email === this.requisition?.user.email);
      this.bVal = this.determineBudgetValues(this.buyer);
    }
  }

  /**  calculates all displayed prices and percentages for a budget related object */
  private determineBudgetValues(data: CostCenter | CostCenterBuyer): BudgetValues {
    if (!data) {
      return;
    }

    const spentBudgetIncludingThisRequisition = PriceHelper.sum(data?.spentBudget, this.orderTotal);

    return {
      budgetLabel: `account.budget.type.${data.budgetPeriod}.label`,
      spentPercentage: data?.spentBudget?.value ? data.spentBudget?.value / data.budget.value : 0,
      spentBudgetIncludingThisRequisition,
      spentPercentageIncludingThisRequisition:
        spentBudgetIncludingThisRequisition?.value && data?.budget?.value
          ? spentBudgetIncludingThisRequisition.value / data?.budget?.value
          : 0,
    };
  }
}
