import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { InjectSingle } from 'ish-core/utils/injection';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

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

  form = new UntypedFormGroup({});
  private submitted = false;

  fields: FormlyFieldConfig[];

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) private loginType: InjectSingle<typeof USER_REGISTRATION_LOGIN_TYPE>,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.loginError$ = this.accountFacade.userError$;

    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        key: 'login',
        type: this.loginType === 'email' ? 'ish-email-field' : 'ish-text-input-field',
        props: {
          label: this.loginType === 'email' ? 'account.login.email.label' : 'account.login.username.label',
          labelClass: this.labelClass || 'col-md-3',
          fieldClass: this.inputClass || 'col-md-6',
          required: true,
          hideRequiredMarker: true,
        },
        validation: {
          messages: {
            required:
              this.loginType === 'email' ? 'form.email.error.required' : 'account.login.username.error.required',
          },
        },
      },
      {
        key: 'password',
        type: 'ish-password-field',
        props: {
          label: 'account.login.password.label',
          labelClass: this.labelClass || 'col-md-3',
          fieldClass: this.inputClass || 'col-md-6',
          required: true,
          hideRequiredMarker: true,
        },
        validation: {
          messages: {
            required: 'account.login.password.error.required',
          },
        },
      },
    ];
  }

  loginUser() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

    this.accountFacade.loginUser(this.form.value);
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
