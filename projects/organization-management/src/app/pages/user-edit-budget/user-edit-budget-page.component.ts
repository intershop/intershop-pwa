import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudget } from '../../models/user-budget/user-budget.model';

@Component({
  selector: 'ish-user-edit-budget-page',
  templateUrl: './user-edit-budget-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditBudgetPageComponent implements OnInit {
  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}
  selectedUser$: Observable<B2bUser>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  budgetForm = new UntypedFormGroup({});

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.error$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;
  }

  submitForm() {
    if (this.budgetForm.valid) {
      const formValue = this.budgetForm.value;

      const budget: UserBudget = formValue
        ? {
            budget: formValue.budgetValue
              ? { value: formValue.budgetValue, currency: formValue.currency, type: 'Money' }
              : undefined,
            budgetPeriod: formValue.budgetPeriod,
            orderSpentLimit: formValue.orderSpentLimitValue
              ? {
                  value: formValue.orderSpentLimitValue,
                  currency: formValue.currency,
                  type: 'Money',
                }
              : undefined,
          }
        : undefined;

      this.organizationManagementFacade.setSelectedUserBudget(budget);
    }
  }
}
