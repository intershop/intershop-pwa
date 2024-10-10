import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile Email Page Component displays a form for changing the user's email address
 * see also: {@link AccountProfileEmailPageComponent}
 */
@Component({
  selector: 'ish-account-profile-email',
  templateUrl: './account-profile-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileEmailComponent implements OnInit {
  @Input({ required: true }) currentUser: User;
  @Input() error: HttpError;

  @Output() updateEmail = new EventEmitter<{ user: User; credentials: Credentials }>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: Partial<User>;

  private submitted = false;

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
            key: 'email',
            type: 'ish-email-field',
            props: {
              label: 'account.update_email.newemail.label',
              hideRequiredMarker: true,
              required: true,
            },
          },
          // New Email confirmation
          {
            key: 'emailConfirmation',
            type: 'ish-text-input-field',
            props: {
              type: 'email',
              hideRequiredMarker: true,
              required: true,
              label: 'account.update_email.email_confirmation.label',
            },
            validation: {
              messages: {
                required: 'account.update_email.email.error.notempty',
                equalTo: 'account.registration.email.not_match.error',
              },
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
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

    const email = this.form.get('email').value;

    this.updateEmail.emit({
      user: { ...this.currentUser, email, login: undefined },
      credentials: { login: this.currentUser.email, password: this.form.get('currentPassword').value },
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
