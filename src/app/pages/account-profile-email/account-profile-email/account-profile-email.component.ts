import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile Email Page Component displays a form for changing the user's email address
 * see also: {@link AccountProfileEmailPageContainerComponent}
 */
@Component({
  selector: 'ish-account-profile-email',
  templateUrl: './account-profile-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileEmailComponent implements OnInit {
  @Input() error: HttpError;
  @Input() currentUser: User;

  @Output() updateEmail = new EventEmitter<{ user: User; credentials: Credentials }>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: Partial<User>;

  submitted = false;

  ngOnInit() {
    this.model = {};
    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        key: 'email',
        type: 'ish-email-field',
        templateOptions: {
          label: 'account.update_email.newemail.label',
          hideRequiredMarker: true,
          required: true,
        },
        validation: {
          messages: {
            required: 'account.update_email.email.error.notempty',
          },
        },
      },

      {
        key: 'emailConfirmation',
        type: 'ish-email-field',

        templateOptions: {
          hideRequiredMarker: true,
          required: true,
          label: 'account.update_email.email_confirmation.label',
        },
        validators: {
          validation: [SpecialValidators.equalToControl('email')],
        },
        validation: {
          messages: {
            required: 'account.update_email.email.error.notempty',
            equalTo: 'account.update_email.email_confirmation.error.stringcompare',
          },
        },
      },
      {
        key: 'currentPassword',
        type: 'ish-password-field',

        templateOptions: {
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
    ];
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
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
