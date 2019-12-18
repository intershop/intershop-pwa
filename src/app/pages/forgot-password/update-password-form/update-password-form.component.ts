import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

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

  password: string;

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required, SpecialValidators.password]),
      passwordConfirmation: new FormControl('', [Validators.required, SpecialValidators.password]),
    });

    // set additional validator
    this.form.get('passwordConfirmation').setValidators(CustomValidators.equalTo(this.form.get('password')));
  }

  submitPasswordForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.submitPassword.emit({
      password: this.form.get('password').value,
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
