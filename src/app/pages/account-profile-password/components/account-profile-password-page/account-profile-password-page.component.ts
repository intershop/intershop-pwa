import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from '../../../../shared/forms/utils/form-utils';
import { SpecialValidators } from '../../../../shared/forms/validators/special-validators';

/**
 * The Account Profile Password Page Component displays a form for changing the user's password
 * see also: {@link AccountProfilePasswordPageContainerComponent}
 */
@Component({
  selector: 'ish-account-profile-password-page',
  templateUrl: './account-profile-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePasswordPageComponent implements OnInit {
  @Input() error: HttpError;

  @Output() updatePassword = new EventEmitter<{ password: string }>();

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

  /**
   * Submits form and throws create event when form is valid
   */
  submit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const password = { password: this.form.get('password').value };

    this.updatePassword.emit(password);
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
