import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators, formlyValidation } from 'ish-shared/forms/validators/special-validators';

import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-punchout-user-form',
  templateUrl: './punchout-user-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PunchoutUserFormComponent implements OnInit {
  @Input() punchoutUser: PunchoutUser;

  /** for new users the punchout type is required */
  @Input() punchoutType: PunchoutType;
  @Output() submitUser = new EventEmitter<PunchoutUser>();

  private submitted = false;
  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  model = {};

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
            props: {
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
        ],
      },
      {
        type: 'ish-fieldset-field',
        validators: {
          validation: [SpecialValidators.equalTo('passwordConfirmation', 'password')],
        },
        fieldGroup: [
          {
            key: 'password',
            type: 'ish-password-field',
            props: {
              postWrappers: [{ wrapper: 'description', index: -1 }],
              label: this.punchoutUser ? 'account.punchout.password.new.label' : 'account.punchout.password.label',
              required: this.punchoutUser ? false : true,
              attributes: { autocomplete: 'new-password' },
              customDescription: {
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },
              hideRequiredMarker: true,
            },
            validators: {
              password: formlyValidation('password', SpecialValidators.password),
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-field',
            props: {
              required: this.punchoutUser ? false : true,
              label: this.punchoutUser
                ? 'account.punchout.password.new.confirmation.label'
                : 'account.punchout.password.confirmation.label',
              attributes: { autocomplete: 'new-password' },
              hideRequiredMarker: true,
            },
            validators: {
              password: formlyValidation('password', SpecialValidators.password),
            },
            validation: {
              messages: {
                required: 'account.punchout.password.confirmation.error.required',
                equalTo: 'form.password.error.equalTo',
              },
            },
          },
          {
            key: 'active',
            type: 'ish-checkbox-field',
            props: {
              label: 'account.user.active.label',
              title: 'account.user.active.title',
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
      focusFirstInvalidField(this.form);
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
