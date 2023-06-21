/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, Subject, take, takeUntil, tap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { whenTruthy } from 'ish-core/utils/operators';
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
export class RegistrationPageComponent implements OnInit, OnDestroy {
  error$: Observable<HttpError>;

  constructor(
    private route: ActivatedRoute,
    private registrationFormConfiguration: RegistrationFormConfigurationService,
    private accountFacade: AccountFacade,
    private featureToggleService: FeatureToggleService,
    private featureEventService: FeatureEventService
  ) {}

  submitted = false;

  loading$: Observable<boolean>;
  registrationConfig: RegistrationConfigType;

  fields: FormlyFieldConfig[];
  model: Record<string, unknown>;
  options: FormlyFormOptions;
  form = new UntypedFormGroup({});

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.error$ = this.registrationFormConfiguration.getErrorSources().pipe(
      whenTruthy(),
      tap(() => this.clearCaptchaToken())
    );

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
    if (this.featureToggleService.enabled('addressDoctor')) {
      const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
        address: this.form.get('address').value,
      });

      this.featureEventService
        .eventResultListener$('addressDoctor', 'check-address', id)
        .pipe(whenTruthy(), take(1), takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data) {
            this.onCreateWithSuggestion(data);
          }
        });
    } else {
      this.submitRegistrationForm();
    }
  }

  onCreateWithSuggestion(address: Address) {
    Object.keys(this.form.get('address').value).forEach(key =>
      (this.form.get('address').get(key) as AbstractControl).setValue(address[key as keyof Address])
    );
    this.submitRegistrationForm();
  }

  submitRegistrationForm() {
    this.registrationFormConfiguration.submitRegistrationForm(this.form, this.registrationConfig, this.model);
  }

  /** return boolean to set submit button enabled/disabled */
  get submitDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }

  private clearCaptchaToken() {
    this.form.get('captcha')?.setValue(undefined);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
