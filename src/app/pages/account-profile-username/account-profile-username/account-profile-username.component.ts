import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile Username Page Component displays a form for changing the user's username
 * see also: {@link AccountProfileUsernamePageComponent}
 */
@Component({
  selector: 'ish-account-profile-username',
  standalone: false,
  templateUrl: './account-profile-username.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUsernameComponent implements OnInit {
  @Input({ required: true }) currentUser: User;
  @Input() error: HttpError;

  @Output() readonly updateUserName = new EventEmitter<{ user: User; credentials: Credentials }>();

  accountProfileUsernameForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: Partial<User>;

  ngOnInit() {
    this.model = {};
    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        validators: {
          validation: [SpecialValidators.equalTo('emailConfirmation', 'email')],
        },
        fieldGroup: [
          // New Email
          {
            key: 'login',
            type: 'ish-text-input-field',
            props: {
              label: 'account.update_username.newusername.label',
              hideRequiredMarker: true,
              required: true,
            },
          },
          // Password
          {
            key: 'currentPassword',
            type: 'ish-password-field',
            props: {
              hideRequiredMarker: true,
              required: true,
              label: 'account.update_email.password.label',
            },
            validation: {
              messages: {
                required: 'account.update_password.old_password.error.required',
              },
            },
          },
        ],
      },
    ];
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submit() {
    if (this.accountProfileUsernameForm.valid) {
      const username = this.accountProfileUsernameForm.get('login').value;

      this.updateUserName.emit({
        user: { ...this.currentUser, login: username },
        credentials: {
          login: this.currentUser.login,
          password: this.accountProfileUsernameForm.get('currentPassword').value,
        },
      });
    }
  }
}
