import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-edit-profile-page',
  templateUrl: './user-edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    FormSubmitDirective,
    LoadingComponent,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    UserProfileFormComponent,
    RouterLink,
  ],
})
export class UserEditProfilePageComponent implements OnInit {
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;
  selectedUser$: Observable<B2bUser>;

  profileForm = new UntypedFormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;
  }

  submitForm(b2bUser: B2bUser) {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      const user: B2bUser = {
        ...b2bUser,
        title: formValue.title,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        active: formValue.active,
        phoneHome: formValue.phoneHome,
      };
      this.organizationManagementFacade.updateUser(user);
    }
  }
}
