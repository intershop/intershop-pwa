import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  @Output() updateEmail = new EventEmitter<User>();

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, SpecialValidators.email]),
        emailConfirmation: new FormControl('', [Validators.required, SpecialValidators.email]),
      },
      SpecialValidators.equalTo('emailConfirmation', 'email')
    );
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
    const login = undefined;
    this.updateEmail.emit({ ...this.currentUser, email, login });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
