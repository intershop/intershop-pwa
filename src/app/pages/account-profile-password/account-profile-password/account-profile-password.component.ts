import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile Password Page Component displays a form for changing the user's password
 * see also: {@link AccountProfilePasswordPageComponent}
 */
@Component({
  selector: 'ish-account-profile-password',
  templateUrl: './account-profile-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePasswordComponent implements OnInit, OnChanges {
  @Input() error: HttpError;

  @Output() updatePassword = new EventEmitter<{ password: string; currentPassword: string }>();

  accountProfilePasswordForm = new FormGroup({});
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        validators: {
          validation: [SpecialValidators.equalTo('passwordConfirmation', 'password')],
        },
        fieldGroup: [
          {
            key: 'currentPassword',
            type: 'ish-password-novalidate-field',
            props: {
              required: true,
              hideRequiredMarker: true,
              label: 'account.password.label',
            },
            validation: {
              messages: {
                incorrect: 'account.update_password.old_password.error.incorrect',
              },
            },
          },
          {
            key: 'password',
            type: 'ish-password-field',
            props: {
              postWrappers: [{ wrapper: 'description', index: -1 }],
              required: true,
              hideRequiredMarker: true,
              label: 'account.update_password.newpassword.label',
              customDescription: {
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-novalidate-field',
            props: {
              required: true,
              hideRequiredMarker: true,
              label: 'account.update_password.newpassword_confirmation.label',
              attributes: { autocomplete: 'new-password' },
            },
            validation: {
              messages: {
                required: 'account.register.password_confirmation.error.default',
                equalTo: 'form.password.error.equalTo',
              },
            },
          },
        ],
      },
    ];
  }

  ngOnChanges(c: SimpleChanges) {
    this.handleErrors(c);
  }

  private handleErrors(c: SimpleChanges) {
    if (c.error?.currentValue?.error && c.error.currentValue.status === 401) {
      this.accountProfilePasswordForm.get('currentPassword').setErrors({ incorrect: true });
      this.accountProfilePasswordForm.get('currentPassword').markAsDirty();
      this.accountProfilePasswordForm.get('currentPassword').markAsTouched();
    }
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submit() {
    if (this.accountProfilePasswordForm.valid) {
      this.updatePassword.emit({
        password: this.accountProfilePasswordForm.get('password').value,
        currentPassword: this.accountProfilePasswordForm.get('currentPassword').value,
      });
    }
  }
}
