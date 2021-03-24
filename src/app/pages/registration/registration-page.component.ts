import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RegistrationConfigurationService } from './registration-configuration/registration-configuration.service';

/**
 * The Registration Page Container renders the customer registration form using the {@link RegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './registration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegistrationConfigurationService],
})
export class RegistrationPageComponent implements OnInit {
  userError$: Observable<HttpError>;

  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    private route: ActivatedRoute,
    private featureToggle: FeatureToggleService,
    private registrationConfiguration: RegistrationConfigurationService
  ) {}

  submitted = false;

  fields$: Observable<FormlyFieldConfig[]>;
  model = {};
  form = new FormGroup({});

  ngOnInit() {
    this.userError$ = this.accountFacade.userError$;
    this.fields$ = this.route.queryParamMap.pipe(
      map((paramMap: ParamMap) => ({
        sso: paramMap.get('sso') === 'true',
        userId: paramMap.get('userid'),
        businessCustomer: this.featureToggle.enabled('businessCustomerRegistration'),
      })),
      tap(config => this.registrationConfiguration.setConfiguration(config)),
      map(() => this.registrationConfiguration.getRegistrationConfiguration())
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
    this.registrationConfiguration.submitRegistration(this.form);
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.form.invalid && this.submitted;
  }
}
