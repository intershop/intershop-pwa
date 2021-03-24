import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Injectable()
// tslint:disable-next-line: project-structure
export class RegistrationConfigurationService {
  registrationConfig: { businessCustomer?: boolean; shortAddress?: boolean };
  constructor(private formlyConfig: FormlyConfig) {}

  getRegistrationConfiguration() {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h1',
          heading: 'account.register.heading',
          subheading: 'account.register.message',
        },
      },
      ...this.getCredentialsConfig(),
      ...this.getCompanyInfoConfig(),
      ...this.getPersonalInfoConfig(),
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: this.registrationConfig.businessCustomer
            ? 'account.register.company_information.heading'
            : 'account.register.address.headding',
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
              businessCustomer: this.registrationConfig.businessCustomer,
            },
          },
          this.registrationConfig.businessCustomer
            ? {
                key: 'taxationID',
                type: 'ish-text-input-field',
                templateOptions: {
                  label: 'account.address.taxation.label',
                },
              }
            : {},
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
        fieldGroup: [
          {
            key: 'login',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email.label',
              required: true,
            },
            validation: {
              messages: {
                required: 'account.update_email.email.error.notempty',
              },
            },
          },
          {
            key: 'loginConfirmation',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email_confirmation.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.equalToControl('login')],
            },
            validation: {
              messages: {
                required: 'account.update_email.email.error.notempty',
                equalTo: 'account.registration.email.not_match.error',
              },
            },
          },

          {
            key: 'password',
            type: 'ish-password-field',
            wrappers: [...(this.formlyConfig.getType('ish-password-field').wrappers ?? []), 'description'],
            templateOptions: {
              required: true,
              label: 'account.register.password.label',
              customDescription: {
                class: 'input-help',
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },

              autocomplete: 'new-password',
            },
            validation: {
              messages: {
                required: 'account.update_password.new_password.error.required',
              },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-field',
            templateOptions: {
              required: true,
              label: 'account.register.password_confirmation.label',

              autocomplete: 'new-password',
            },
            validators: {
              validation: [SpecialValidators.equalToControl('password')],
            },
            validation: {
              messages: {
                required: 'account.register.password_confirmation.error.default',
                equalTo: 'account.update_password.confirm_password.error.stringcompare',
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
          heading: 'Personal Information',
          showRequiredInfo: true,
        },
      },
    ];
  }

  private getCompanyInfoConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'Company Information',
          showRequiredInfo: true,
        },
      },
    ];
  }
}
