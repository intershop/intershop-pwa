import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { UserBudgets } from '../../models/user-budgets/user-budgets.model';

@Component({
  selector: 'ish-budget-widget',
  templateUrl: './budget-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetWidgetComponent implements OnInit {
  userBudget$: Observable<UserBudgets>;
  budgetLoading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.userBudget$ = this.organizationManagementFacade.loggedInUserBudget$();
    this.budgetLoading$ = this.organizationManagementFacade.loggedInUserBudgetLoading$;
    this.error$ = this.organizationManagementFacade.loggedInUserBudgetError$;
  }
}
