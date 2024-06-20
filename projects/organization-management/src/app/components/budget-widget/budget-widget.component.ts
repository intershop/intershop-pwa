import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UserBudget } from 'ish-core/models/user-budget/user-budget.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

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
