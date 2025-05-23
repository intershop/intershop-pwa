import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

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

  ngOnInit() {
    this.fields = [
      {
        validators: {
          validation: [SpecialValidators.equalTo('passwordConfirmation', 'password')],
        },
        fieldGroup: [
          {
            key: 'password',
            type: 'ish-password-field',
            props: {
              postWrappers: [{ wrapper: 'description', index: -1 }],
              required: true,
              hideRequiredMarker: true,
              label: 'account.register.password.label',
              customDescription: {
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },
            },
            validation: {
              messages: {
                minLength: 'account.update_password.new_password.error.length',
              },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-novalidate-field',
            props: {
              required: true,
              hideRequiredMarker: true,
              label: 'account.register.password_confirmation.label',
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

  submitPasswordForm() {
    if (this.updatePasswordForm.valid) {
      this.submitPassword.emit({
        password: this.updatePasswordForm.get('password').value,
      });
    }
  }
}
