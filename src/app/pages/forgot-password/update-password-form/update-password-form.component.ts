import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Update Password Form Component displays a Forgot Password Update Password form and triggers the submit.
 *
 * @example
 * <ish-update-password-form
 *               (submitPassword)="submitPassword($event)"
 * ></ish-update-password-form>
 */
@Component({
  selector: 'ish-update-password-form',
  templateUrl: './update-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password change.
   */
  @Output() submitPassword = new EventEmitter<{ password: string }>();

  updatePasswordForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  submitted = false;

  ngOnInit() {
    this.fields = [
      {
        key: 'password',
        type: 'ish-password-field',
        templateOptions: {
          postWrappers: ['description'],
          required: true,
          hideRequiredMarker: true,
          label: 'account.register.password.label',
          customDescription: {
            class: 'input-help',
            key: 'account.register.password.extrainfo.message',
            args: { 0: '7' },
          },
        },
        validation: {
          messages: {
            required: 'account.update_password.new_password.error.required',
            minLength: 'account.update_password.new_password.error.length',
          },
        },
      },
      {
        key: 'passwordConfirmation',
        type: 'ish-password-field',
        templateOptions: {
          required: true,
          hideRequiredMarker: true,
          label: 'account.register.password_confirmation.label',
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

  submitPasswordForm() {
    if (this.updatePasswordForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.updatePasswordForm);
      return;
    }

    this.submitPassword.emit({
      password: this.updatePasswordForm.get('password').value,
    });
  }

  get buttonDisabled() {
    return this.updatePasswordForm.invalid && this.submitted;
  }
}
