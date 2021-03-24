import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import {
  RegistrationConfigType,
  RegistrationFormConfigurationService,
} from 'ish-core/services/registration-form-configuration/registration-form-configuration.service';

// tslint:disable:no-intelligence-in-artifacts
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
    private route: ActivatedRoute,
    private featureToggle: FeatureToggleService,
    private registrationFormConfiguration: RegistrationFormConfigurationService
  ) {}

  submitted = false;

  registrationConfig: RegistrationConfigType;

  fields$: Observable<FormlyFieldConfig[]>;
  model: Record<string, unknown>;
  options: FormlyFormOptions;
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
      tap(
        config =>
          (this.options = this.registrationFormConfiguration.getRegistrationFormConfigurationOptions(
            config,
            this.model
          ))
      ),
      map(config => this.registrationFormConfiguration.getRegistrationFormConfiguration(config))
    );
  }

  cancelForm() {
    this.registrationFormConfiguration.cancelRegistrationForm(this.registrationConfig);
  }

  onCreate() {
    if (this.form.invalid) {
      this.submitted = true;
      return;
    }
    this.registrationFormConfiguration.submitRegistrationForm(this.form, this.registrationConfig, this.model);
  }

  /** return boolean to set submit button enabled/disabled */
  get submitDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }

  processParamMap(paramMap: ParamMap) {
    return paramMap.keys
      .filter(key => !['sso', 'userid'].includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: paramMap.get(key) }), { ...this.model });
  }
}
