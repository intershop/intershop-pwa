import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-edit-profile-page',
  templateUrl: './user-edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditProfilePageComponent implements OnInit {
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;
  selectedUser$: Observable<B2bUser>;

  submitted = false;
  profileForm = new FormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;
  }

  submitForm(b2buser: B2bUser) {
    if (this.profileForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.profileForm);
      return;
    }

    const formValue = this.profileForm.value;

    const user: B2bUser = {
      ...b2buser,
      title: formValue.title,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      active: formValue.active,
      phoneHome: formValue.phoneHome,
    };
    this.organizationManagementFacade.updateUser(user);
  }

  get formDisabled() {
    return this.profileForm.invalid && this.submitted;
  }
}
