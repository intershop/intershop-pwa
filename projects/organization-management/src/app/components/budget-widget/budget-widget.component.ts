import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { UserBudget } from '../../models/user-budget/user-budget.model';

@Component({
  selector: 'ish-budget-widget',
  templateUrl: './budget-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BudgetWidgetComponent implements OnInit {
  userBudget$: Observable<UserBudget>;
  budgetLoading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.userBudget$ = this.organizationManagementFacade.loggedInUserBudget$();
    this.budgetLoading$ = this.organizationManagementFacade.loggedInUserBudgetLoading$;
    this.error$ = this.organizationManagementFacade.loggedInUserBudgetError$;
  }
}
