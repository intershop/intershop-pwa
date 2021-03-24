import { ChangeDetectionStrategy, Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export const REGISTRATION_CONFIGURATION = new InjectionToken<RegistrationConfiguration>('registrationConfiguration');

export interface RegistrationConfiguration {
  getRegistrationConfiguration(registrationConfig: RegistrationConfigType): FormlyFieldConfig[];
  submitRegistration(form: FormGroup, registrationConfig: RegistrationConfigType): void;
}

export interface RegistrationConfigType {
  businessCustomer?: boolean;
  sso?: boolean;
  userId?: string;
}

/**
 * The Registration Page Container renders the customer registration form using the {@link RegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './registration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  error$: Observable<HttpError>;

  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    private route: ActivatedRoute,
    private featureToggle: FeatureToggleService,
    @Inject(REGISTRATION_CONFIGURATION) private registrationConfigurationProvider: RegistrationConfiguration
  ) {}

  submitted = false;

  registrationConfig: RegistrationConfigType;

  fields$: Observable<FormlyFieldConfig[]>;
  model: { [key: string]: unknown };
  form = new FormGroup({});

  ngOnInit() {
    this.error$ = merge(this.accountFacade.userError$, this.accountFacade.ssoRegistrationError$);
    this.fields$ = this.route.queryParamMap.pipe(
      tap((paramMap: ParamMap) => (this.model = this.processParamMap(paramMap))),
      map((paramMap: ParamMap) => ({
        sso: paramMap.get('sso') === 'true',
        userId: paramMap.get('userid'),
        businessCustomer: this.featureToggle.enabled('businessCustomerRegistration'),
      })),
      tap(config => (this.registrationConfig = config)),
      map(config => this.registrationConfigurationProvider.getRegistrationConfiguration(config))
    );
  }

  cancelForm() {
    this.router.navigate(['/home']);
  }

  onCreate() {
    if (this.form.invalid) {
      this.submitted = true;
      return;
    }
    this.registrationConfigurationProvider.submitRegistration(this.form, this.registrationConfig);
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }

  processParamMap(paramMap: ParamMap) {
    return paramMap.keys
      .filter(key => !['sso', 'userid'].includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: paramMap.get(key) }), { ...this.model });
  }
}
