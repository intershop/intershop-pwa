import { Provider } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyAttributes, FormlyField, FormlyForm, FormlyTemplate, FormlyValidationMessage } from '@ngx-formly/core';

import { FORMS_SHARED_IMPORTS } from 'ish-shared/forms/forms.imports';

import { FormlyAddressExtensionFormComponent } from './components/formly-address-extension-form/formly-address-extension-form.component';
import { FormlyAddressFormComponent } from './components/formly-address-form/formly-address-form.component';
import {
  ADDRESS_FORM_CONFIGURATION,
  AddressFormConfigurationProvider,
} from './configurations/address-form-configuration.provider';
import { AddressFormDEConfiguration } from './configurations/de/address-form-de.configuration';
import { AddressFormDefaultConfiguration } from './configurations/default/address-form-default.configuration';
import { AddressFormFRConfiguration } from './configurations/fr/address-form-fr.configuration';
import { AddressFormGBConfiguration } from './configurations/gb/address-form-gb.configuration';
import { AddressFormUSConfiguration } from './configurations/us/address-form-us.configuration';

export function provideIshFormlyAddressForms(): Provider[] {
  return [
    AddressFormConfigurationProvider,
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormDEConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormDefaultConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormUSConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormFRConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormGBConfiguration, multi: true },
  ];
}

export const FORMLY_ADDRESS_FORMS_COMPONENTS = [
  FormlyAddressExtensionFormComponent,
  FormlyAddressFormComponent,
] as const;

export const FORMLY_ADDRESS_FORMS_IMPORTS = [
  ...FORMLY_ADDRESS_FORMS_COMPONENTS,
  FormlyAttributes,
  FormlyField,
  FormlyForm,
  FormlyTemplate,
  FormlyValidationMessage,
  ...FORMS_SHARED_IMPORTS,
  ReactiveFormsModule,
] as const;

export { FormlyAddressExtensionFormComponent } from './components/formly-address-extension-form/formly-address-extension-form.component';
export { FormlyAddressFormComponent } from './components/formly-address-form/formly-address-form.component';
