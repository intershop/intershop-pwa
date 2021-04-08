import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, merge } from 'rxjs';

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

  fields: FormlyFieldConfig[];
  model: Record<string, unknown>;
  options: FormlyFormOptions;
  form = new FormGroup({});

  ngOnInit() {
    this.error$ = merge(this.accountFacade.userError$, this.accountFacade.ssoRegistrationError$);

    const snapshot = this.route.snapshot;
    this.model = this.extractModel(snapshot);
    this.registrationConfig = this.extractConfig(snapshot);
    this.options = this.registrationFormConfiguration.getRegistrationFormConfigurationOptions(
      this.registrationConfig,
      this.model
    );
    this.fields = this.registrationFormConfiguration.getRegistrationFormConfiguration(this.registrationConfig);
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

  extractModel(route: ActivatedRouteSnapshot) {
    return Object.keys(route.queryParams)
      .filter(key => !['userid'].includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: route.queryParams[key] }), { ...this.model });
  }

  extractConfig(route: ActivatedRouteSnapshot) {
    return {
      sso: !!route.url.find(segment => segment.path.includes('sso')),
      userId: route.queryParams.userid,
      businessCustomer: this.featureToggle.enabled('businessCustomerRegistration'),
    };
  }
}
