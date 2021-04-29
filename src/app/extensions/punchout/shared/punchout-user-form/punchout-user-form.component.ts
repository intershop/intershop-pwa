import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-punchout-user-form',
  templateUrl: './punchout-user-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PunchoutUserFormComponent implements OnInit {
  @Input() punchoutUser?: PunchoutUser;

  /** for new users the punchout type is required */
  @Input() punchoutType?: PunchoutType;
  @Output() submitUser = new EventEmitter<PunchoutUser>();

  submitted = false;
  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  model = {};

  constructor(private config: FormlyConfig) {}

  ngOnInit() {
    this.checkInput();

    this.model = this.setModel();
    this.fields = this.setFields();
  }

  private checkInput() {
    if (!this.punchoutUser && !this.punchoutType) {
      throw new Error(
        'PunchoutUserFormComponent is called without input parameters, either punchoutUser or punchoutType is required'
      );
    }
  }

  private setModel() {
    return this.punchoutUser ? { ...this.punchoutUser } : { active: true };
  }

  private setFields() {
    return [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'login',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.punchout.username.label',
              required: true,
              hideRequiredMarker: true,
              disabled: !!this.punchoutUser,
            },
            validators: {
              validation: [SpecialValidators.punchoutLogin],
            },
            validation: {
              messages: {
                required: 'account.punchout.username.error.required',
                punchoutLogin: 'account.punchout.username.invalid',
              },
            },
          },
          {
            key: 'active',
            type: 'ish-checkbox-field',
            templateOptions: {
              label: 'account.user.active.label',
            },
          },
        ],
      },
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'password',
            type: 'ish-password-field',
            wrappers: [...this.config.getType('ish-password-field').wrappers, 'description'],
            templateOptions: {
              label: this.punchoutUser ? 'account.punchout.password.new.label' : 'account.punchout.password.label',
              required: this.punchoutUser ? false : true,
              autocomplete: 'new-password',
              customDescription: {
                class: 'input-help',
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },
              hideRequiredMarker: true,
            },
            validation: {
              messages: {
                required: 'account.punchout.password.error.required',
              },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-field',
            templateOptions: {
              required: this.punchoutUser ? false : true,
              label: this.punchoutUser
                ? 'account.punchout.password.new.confirmation.label'
                : 'account.punchout.password.confirmation.label',
              autocomplete: 'new-password',
              hideRequiredMarker: true,
            },
            validators: {
              validation: [SpecialValidators.equalToControl('password')],
            },
            validation: {
              messages: {
                required: 'account.punchout.password.confirmation.error.required',
                equalTo: 'account.update_password.confirm_password.error.stringcompare',
              },
            },
          },
        ],
      },
    ];
  }

  /** emit punchout user, when form is valid - mark form as dirty, when form is invalid */
  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    if (this.punchoutUser) {
      this.submitUser.emit({
        ...this.punchoutUser,
        active: this.form.value.active,
        password: this.form.value.password,
      });
    } else {
      this.submitUser.emit({ ...this.form.value, punchoutType: this.punchoutType });
    }
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }
}
