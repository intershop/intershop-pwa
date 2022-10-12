/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, combineLatest, from, iif, merge, noop, of, race } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { ConfirmLeaveModalComponent } from 'ish-shared/components/registration/confirm-leave-modal/confirm-leave-modal.component';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

export interface RegistrationConfigType {
  businessCustomer?: boolean;
  sso?: boolean;
  userId?: string;
  cancelUrl?: string;
}

@Injectable()
// eslint-disable-next-line ish-custom-rules/project-structure
export class RegistrationFormConfigurationService {
  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    private modalService: NgbModal,
    private featureToggle: FeatureToggleService,
    private fieldLibrary: FieldLibrary
  ) {}

  extractConfig(route: ActivatedRouteSnapshot) {
    return {
      sso: !!route.url.find(segment => segment.path.includes('sso')),
      userId: route.queryParams.userid,
      businessCustomer: this.featureToggle.enabled('businessCustomerRegistration'),
      cancelUrl: route.queryParams.cancelUrl,
    };
  }

  extractModel(route: ActivatedRouteSnapshot, model?: Record<string, unknown>) {
    return Object.keys(route.queryParams)
      .filter(key => !['userid'].includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: route.queryParams[key] }), { ...model });
  }

  getFields(registrationConfig: RegistrationConfigType): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h1',
          heading: registrationConfig.sso ? 'account.register.complete_heading' : 'account.register.heading',
          subheading: 'account.register.message',
        },
      },
      ...(!registrationConfig.sso ? this.getCredentialsConfig() : []),
      ...(registrationConfig.businessCustomer ? this.getCompanyInfoConfig() : []),
      ...this.getPersonalInfoConfig(),
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.address.headding',
          subheading: 'account.register.address.message',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            type: 'ish-registration-address-field',
            templateOptions: {
              businessCustomer: registrationConfig.businessCustomer,
            },
          },
          {
            type: 'ish-registration-tac-field',
            key: 'termsAndConditions',
            templateOptions: {
              required: true,
            },
            validators: {
              validation: [Validators.pattern('true')],
            },
          },
          {
            type: 'ish-captcha-field',
            templateOptions: {
              topic: 'register',
            },
          },
        ],
      },
    ];
  }

  getOptions(registrationConfig: RegistrationConfigType, model: Record<string, unknown>): FormlyFormOptions {
    if (registrationConfig.sso) {
      return { formState: { disabled: Object.keys(model) } };
    } else {
      return {};
    }
  }

  submitRegistrationForm(form: FormGroup, registrationConfig: RegistrationConfigType, model?: Record<string, unknown>) {
    const formValue = { ...form.value, ...model };

    const address: Address = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      ...formValue.address,
      phoneHome: formValue.phoneHome,
    };

    if (registrationConfig.sso && registrationConfig.userId) {
      this.accountFacade.setRegistrationInfo({
        companyInfo: {
          companyName1: formValue.companyName1,
          companyName2: formValue.companyName2,
          taxationID: formValue.taxationID,
        },
        address,
        userId: registrationConfig.userId,
      });
    } else {
      const customer: Customer = {
        isBusinessCustomer: false,
        customerNo: uuid(), // TODO: customerNo should be generated by the server - IS-24884
      };

      const user: User = {
        title: formValue.title,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.login,
        phoneHome: formValue.phoneHome,
        birthday: formValue.birthday === '' ? undefined : formValue.birthday, // TODO: see IS-22276
      };

      const credentials: Credentials = {
        login: formValue.login,
        password: formValue.password,
      };

      if (registrationConfig.businessCustomer) {
        customer.isBusinessCustomer = true;
        customer.companyName = formValue.companyName1;
        customer.companyName2 = formValue.companyName2;
        customer.taxationID = formValue.taxationID;
        user.businessPartnerNo = `U${customer.customerNo}`;
      }

      const registration: CustomerRegistrationType = { customer, user, credentials, address };
      registration.captcha = form.get('captcha').value;
      registration.captchaAction = form.get('captchaAction').value;

      this.accountFacade.createUser(registration);
    }
  }

  cancelRegistrationForm(config: RegistrationConfigType): void {
    config.sso ? this.accountFacade.cancelRegistration() : this.router.navigate([config.cancelUrl ?? '/home']);
  }

  canDeactivate(config: RegistrationConfigType): boolean | Observable<boolean> {
    if (!config.sso) {
      return true;
    } else {
      return combineLatest([
        this.accountFacade.ssoRegistrationCancelled$,
        this.accountFacade.ssoRegistrationRegistered$,
      ]).pipe(
        take(1),
        switchMap(([cancelled, registered]) =>
          iif(
            () => cancelled || registered,
            of(true),
            of({}).pipe(
              map(() => this.modalService.open(ConfirmLeaveModalComponent)),
              switchMap(modalRef => race(modalRef.dismissed, from(modalRef.result))),
              tap(result => (result ? this.accountFacade.cancelRegistration() : noop))
            )
          )
        )
      );
    }
  }

  getErrorSources() {
    return merge(
      this.accountFacade.userError$.pipe(filter(error => error.status !== 404)),
      this.accountFacade.ssoRegistrationError$
    );
  }

  private getCredentialsConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',

        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.email_password.heading',
          subheading: 'account.register.email_password.message',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        validators: {
          validation: [
            SpecialValidators.equalTo('loginConfirmation', 'login'),
            SpecialValidators.equalTo('passwordConfirmation', 'password'),
          ],
        },
        fieldGroup: [
          {
            key: 'login',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email.label',
              required: true,
            },
          },
          {
            key: 'loginConfirmation',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email_confirmation.label',
              required: true,
            },
            validation: {
              messages: {
                equalTo: 'account.registration.email.not_match.error',
              },
            },
          },

          {
            key: 'password',
            type: 'ish-password-field',
            templateOptions: {
              postWrappers: [{ wrapper: 'description', index: -1 }],
              required: true,
              label: 'account.register.password.label',
              customDescription: {
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },
              attributes: { autocomplete: 'new-password' },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-field',
            templateOptions: {
              required: true,
              label: 'account.register.password_confirmation.label',

              attributes: { autocomplete: 'new-password' },
            },
            validation: {
              messages: {
                required: 'account.register.password_confirmation.error.default',
              },
            },
          },
        ],
      },
    ];
  }

  private getPersonalInfoConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.personal_information.heading',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: this.fieldLibrary.getConfigurationGroup('personalInfo'),
      },
    ];
  }

  private getCompanyInfoConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.company_information.heading',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: this.fieldLibrary.getConfigurationGroup('companyInfo'),
      },
    ];
  }
}
