/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import {
  RegistrationConfigType,
  RegistrationFormConfigurationService,
} from './services/registration-form-configuration/registration-form-configuration.service';

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
    private route: ActivatedRoute,
    private registrationFormConfiguration: RegistrationFormConfigurationService,
    private accountFacade: AccountFacade
  ) {}

  submitted = false;

  loading$: Observable<boolean>;
  registrationConfig: RegistrationConfigType;

  fields: FormlyFieldConfig[];
  model: Record<string, unknown>;
  options: FormlyFormOptions;
  form = new FormGroup({});

  ngOnInit() {
    this.error$ = this.registrationFormConfiguration.getErrorSources();

    const snapshot = this.route.snapshot;
    this.model = this.registrationFormConfiguration.extractModel(snapshot);
    this.registrationConfig = this.registrationFormConfiguration.extractConfig(snapshot);
    this.options = this.registrationFormConfiguration.getOptions(this.registrationConfig, this.model);
    this.fields = this.registrationFormConfiguration.getFields(this.registrationConfig);
    this.loading$ = this.accountFacade.userLoading$;
  }

  cancelForm() {
    this.registrationFormConfiguration.cancelRegistrationForm(this.registrationConfig);
  }

  onCreate() {
    if (this.form.invalid) {
      markAsDirtyRecursive(this.form);
      this.submitted = true;
      return;
    }
    // keep-localization-pattern: ^customer\..*\.error$
    this.registrationFormConfiguration.submitRegistrationForm(this.form, this.registrationConfig, this.model);
  }

  /** return boolean to set submit button enabled/disabled */
  get submitDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }
}
