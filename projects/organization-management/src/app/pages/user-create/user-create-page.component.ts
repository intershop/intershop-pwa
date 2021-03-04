import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-create-page',
  templateUrl: './user-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;

  form: FormGroup = this.fb.group({
    profile: this.fb.group({}),
    roleIDs: this.fb.control([]),
    userBudget: this.fb.group({}),
  });

  submitted = false;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
  }

  get profile(): FormGroup {
    return this.form.get('profile') as FormGroup;
  }

  get budgetForm() {
    return this.form.get('userBudget') as FormGroup;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;

    const user: B2bUser = {
      title: formValue.profile.title,
      firstName: formValue.profile.firstName,
      lastName: formValue.profile.lastName,
      email: formValue.profile.email,
      active: formValue.profile.active,
      phoneHome: formValue.profile.phoneHome,
      birthday: formValue.profile.birthday === '' ? undefined : formValue.birthday, // TODO: see IS-22276
      businessPartnerNo: 'U' + UUID.UUID(),
      roleIDs: formValue.roleIDs,
      userBudget: formValue.userBudget.currency
        ? {
            budget: formValue.userBudget.budgetValue
              ? { value: formValue.userBudget.budgetValue, currency: formValue.userBudget.currency, type: 'Money' }
              : undefined,
            budgetPeriod: formValue.userBudget.budgetPeriod,
            orderSpentLimit: formValue.userBudget.orderSpentLimitValue
              ? {
                  value: formValue.userBudget.orderSpentLimitValue,
                  currency: formValue.userBudget.currency,
                  type: 'Money',
                }
              : undefined,
          }
        : undefined,
    };

    this.organizationManagementFacade.addUser(user);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
