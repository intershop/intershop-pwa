import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Login Form Page Container displays a login form using the {@link LoginFormComponent} and signs the user in
 * Set the Url query parameter returnUrl as page Url after successful Logging in, e.g.
 * <a
    routerLink="/login"
    [queryParams]="{ returnUrl: '/account' }"
    class="my-account-link my-account-login"
    rel="nofollow"
  >
 *
 * @example:
 * <ish-login-form></ish-login-form>
 */
@Component({
  selector: 'ish-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  @Input() labelClass: string;
  @Input() inputClass: string;
  @Input() forgotPasswordClass: string;
  @Input() signInClass: string;

  loginError$: Observable<HttpError>;

  form: FormGroup;
  submitted = false;

  constructor(@Inject(USER_REGISTRATION_LOGIN_TYPE) public loginType: string, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.loginError$ = this.accountFacade.userError$;

    const loginValidator = this.loginType === 'email' ? SpecialValidators.email : Validators.nullValidator;

    this.form = new FormGroup({
      login: new FormControl('', [Validators.required, loginValidator]),
      password: new FormControl('', Validators.required),
    });
  }

  loginUser() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.accountFacade.loginUser(this.form.value);
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
