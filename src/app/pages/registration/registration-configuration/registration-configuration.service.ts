import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Injectable()
export class RegistrationConfigurationService {
  registrationConfig: { businessCustomer?: boolean; sso?: boolean };
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
      ...(!this.registrationConfig.sso ? this.getCredentialsConfig() : []),
      ...(this.registrationConfig.businessCustomer ? this.getCompanyInfoConfig() : []),
      ...this.getPersonalInfoConfig(),
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'Address',
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
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.default_address.firstname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.address.firstname.missing.error',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.default_address.lastname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.address.lastname.missing.error',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.profile.phone.label',
              required: false,
            },
          },
        ],
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
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.company_name.label',
              required: true,
            },
            validation: {
              messages: {
                required: 'account.address.company_name.error.required',
              },
            },
          },
          {
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.company_name_2.label',
              required: false,
            },
          },
          {
            key: 'taxationID',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.taxation.label',
            },
          },
        ],
      },
    ];
  }
}
