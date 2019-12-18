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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

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

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    this.form = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, SpecialValidators.password]),
      passwordConfirmation: new FormControl('', [Validators.required, SpecialValidators.password]),
    });

    // set additional validator
    this.form.get('passwordConfirmation').setValidators(CustomValidators.equalTo(this.form.get('password')));
  }

  ngOnChanges(c: SimpleChanges) {
    this.handleErrors(c);
  }

  handleErrors(c: SimpleChanges) {
    if (c.error && c.error.currentValue && c.error.currentValue.error && c.error.currentValue.status === 401) {
      this.form.controls.currentPassword.setErrors({ incorrect: true });
      this.form.controls.currentPassword.markAsDirty();
      this.form.controls.currentPassword.markAsTouched();
    }
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

    this.updatePassword.emit({
      password: this.form.get('password').value,
      currentPassword: this.form.get('currentPassword').value,
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
