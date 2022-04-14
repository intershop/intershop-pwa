import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile User Page Component displays a form for changing the user's profile data
 * see also: {@link AccountProfileUserPageComponent}
 */
@Component({
  selector: 'ish-account-profile-user',
  templateUrl: './account-profile-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserComponent implements OnInit {
  @Input() currentUser: User;
  @Input() error: HttpError;

  @Output() updateUserProfile = new EventEmitter<User>();

  submitted = false;

  accountProfileUserForm = new FormGroup({});
  model: Partial<User>;
  fields: FormlyFieldConfig[];

  constructor(private fieldLibrary: FieldLibrary) {}

  ngOnInit() {
    this.model = pick(this.currentUser, 'title', 'firstName', 'lastName', 'phoneHome');
    this.fields = this.fieldLibrary.getConfigurationGroup('personalInfo');
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.accountProfileUserForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.accountProfileUserForm);
      return;
    }

    const title = this.accountProfileUserForm.get('title').value;
    const firstName = this.accountProfileUserForm.get('firstName').value;
    const lastName = this.accountProfileUserForm.get('lastName').value;
    const phoneHome = this.accountProfileUserForm.get('phoneHome').value;

    this.updateUserProfile.emit({ ...this.currentUser, title, firstName, lastName, phoneHome });
  }

  get buttonDisabled() {
    return this.accountProfileUserForm.invalid && this.submitted;
  }
}
