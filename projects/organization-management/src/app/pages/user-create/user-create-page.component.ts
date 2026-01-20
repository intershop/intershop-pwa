import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { DirectivesModule } from 'ish-core/directives.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { OrganizationManagementModule } from '../../organization-management.module';

import { UserCsvImportComponent } from './user-csv-import/user-csv-import.component';

@Component({
  selector: 'ish-user-create-page',
  templateUrl: './user-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    DirectivesModule,
    LoadingComponent,
    NgIf,
    OrganizationManagementModule,
    ReactiveFormsModule,
    RouterModule,
    ServerSettingPipe,
    TranslateModule,
    UserCsvImportComponent,
  ],
})
export class UserCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;

  form: FormGroup = this.fb.group({
    profile: this.fb.group({}),
    roleIDs: this.fb.control([]),
    userBudget: this.fb.group({}),
  });

  constructor(
    private fb: FormBuilder,
    private organizationManagementFacade: OrganizationManagementFacade
  ) {}

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
    if (this.form.valid) {
      const formValue = this.form.value;

      const user: B2bUser = {
        title: formValue.profile.title,
        firstName: formValue.profile.firstName,
        lastName: formValue.profile.lastName,
        email: formValue.profile.email,
        active: formValue.profile.active,
        phoneHome: formValue.profile.phoneHome,
        birthday: formValue.profile.birthday === '' ? undefined : formValue.birthday,
        businessPartnerNo: `U${uuid()}`,
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
  }
}
