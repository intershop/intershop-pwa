import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

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
    profile: this.fb.group({
      title: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      active: [true],
      phone: [''],
      birthday: [''],
      preferredLanguage: ['en_US', [Validators.required]],
    }),
    roleIDs: this.fb.control([]),
    budgets: this.fb.group({
      orderSpentLimit: ['', SpecialValidators.moneyAmount],
      budget: ['', SpecialValidators.moneyAmount],
      budgetPeriod: ['weekly'],
      currency: [''],
    }),
  });

  submitted = false;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
  }

  get profileForm() {
    return this.form.get('profile');
  }

  get budgetsForm() {
    return this.form.get('budgets');
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
      phoneHome: formValue.profile.phone,
      birthday: formValue.profile.birthday === '' ? undefined : formValue.birthday, // TODO: see IS-22276
      preferredLanguage: formValue.profile.preferredLanguage,
      businessPartnerNo: 'U' + UUID.UUID(),
      roleIDs: formValue.roleIDs,
      budgets: formValue.budgets.currency
        ? {
            budget: formValue.budgets.budget
              ? { value: formValue.budgets.budget, currency: formValue.budgets.currency, type: 'Money' }
              : undefined,
            budgetPeriod: formValue.budgets.budgetPeriod,
            orderSpentLimit: formValue.budgets.orderSpentLimit
              ? {
                  value: formValue.budgets.orderSpentLimit,
                  currency: formValue.budgets.currency,
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
