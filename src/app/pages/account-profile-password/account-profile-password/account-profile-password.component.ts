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
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile Password Page Component displays a form for changing the user's password
 * see also: {@link AccountProfilePasswordPageContainerComponent}
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
  submitted = false;

  constructor(private config: FormlyConfig) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'currentPassword',
        type: 'ish-password-field',
        templateOptions: {
          required: true,
          hideRequiredMarker: true,
          label: 'account.password.label',
        },
        validation: {
          messages: {
            required: 'account.update_password.old_password.error.required',
            incorrect: 'account.update_password.old_password.error.incorrect',
          },
        },
      },
      {
        key: 'password',
        type: 'ish-password-field',
        wrappers: [...(this.config.getType('ish-password-field').wrappers ?? []), 'description'],
        templateOptions: {
          required: true,
          hideRequiredMarker: true,
          label: 'account.update_password.newpassword.label',
          customDescription: {
            class: 'input-help',
            key: 'account.register.password.extrainfo.message',
            args: { 0: '7' },
          },

          autocomplete: 'new-password',
        },
        validation: {
          messages: {
            required: 'account.update_password.new_password.error.required',
          },
        },
      },
      {
        key: 'passwordConfirmation',
        type: 'ish-password-field',
        templateOptions: {
          required: true,
          hideRequiredMarker: true,
          label: 'account.update_password.newpassword_confirmation.label',
        },
        validators: {
          validation: [SpecialValidators.equalToControl('password')],
        },
        validation: {
          messages: {
            required: 'account.register.password_confirmation.error.default',
            equalTo: 'account.update_password.confirm_password.error.stringcompare',
          },
        },
      },
    ];
  }

  ngOnChanges(c: SimpleChanges) {
    this.handleErrors(c);
  }

  handleErrors(c: SimpleChanges) {
    if (c.error && c.error.currentValue && c.error.currentValue.error && c.error.currentValue.status === 401) {
      this.accountProfilePasswordForm.controls.currentPassword.setErrors({ incorrect: true });
      this.accountProfilePasswordForm.controls.currentPassword.markAsDirty();
      this.accountProfilePasswordForm.controls.currentPassword.markAsTouched();
    }
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submit() {
    if (this.accountProfilePasswordForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.accountProfilePasswordForm);
      return;
    }

    this.updatePassword.emit({
      password: this.accountProfilePasswordForm.get('password').value,
      currentPassword: this.accountProfilePasswordForm.get('currentPassword').value,
    });
  }

  get buttonDisabled() {
    return this.accountProfilePasswordForm.invalid && this.submitted;
  }
}
