import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-edit-profile-page',
  templateUrl: './user-edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditProfilePageComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;
  selectedUser$: Observable<B2bUser>;
  private destroy$ = new Subject();

  error: HttpError;
  profileForm: FormGroup;

  user: B2bUser;
  submitted = false;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;

    this.selectedUser$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      this.editUserProfileForm(user);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUserProfileForm(userProfile: B2bUser) {
    this.profileForm = this.fb.group({
      title: [userProfile.title ? userProfile.title : ''],
      firstName: [userProfile.firstName, [Validators.required]],
      lastName: [userProfile.lastName, [Validators.required]],
      active: [userProfile.active],
      phone: [userProfile.phoneHome],
    });
  }

  submitForm() {
    if (this.profileForm.invalid) {
      markAsDirtyRecursive(this.profileForm);
      return;
    }

    const formValue = this.profileForm.value;

    const user: B2bUser = {
      ...this.user,
      title: formValue.title,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      active: formValue.active,
      phoneHome: formValue.phone,
    };
    this.organizationManagementFacade.updateUser(user);
  }

  get formDisabled() {
    return this.profileForm.invalid && this.submitted;
  }
}
