import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

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
 * <ish-login-form />
 */
@Component({
  selector: 'ish-login-form',
  standalone: false,
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
  fields: FormlyFieldConfig[];

  private loginType: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.appFacade
      .serverSetting$<string>('preferences.UserCredentialPreferences.UserRegistrationLoginType')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loginType => {
        this.loginType = loginType;
        this.fields = this.getFields();
      });
    this.loginError$ = this.accountFacade.userError$;
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
        type: 'ish-password-novalidate-field',
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
    if (this.form.valid) {
      this.accountFacade.loginUser(this.form.value);
    }
  }
}
