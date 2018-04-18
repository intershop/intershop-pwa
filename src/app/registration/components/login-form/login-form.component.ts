import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { markAsDirtyRecursive } from '../../../utils/form-utils';
import { AccountLogin } from '../../services/registration/account-login.model';

@Component({
  selector: 'ish-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  @Input() loginType: string;
  @Input() isLoggedIn: boolean;
  @Input() error: HttpErrorResponse;
  @Output() login = new EventEmitter<AccountLogin>();

  ngOnInit() {
    let userNameValidator;
    if (this.loginType === 'email') {
      userNameValidator = CustomValidators.email;
    } else {
      userNameValidator = Validators.nullValidator;
    }

    this.form = new FormGroup({
      userName: new FormControl('', [Validators.required, userNameValidator]),
      password: new FormControl('', Validators.required),
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.login.emit(this.form.value);
  }
}
