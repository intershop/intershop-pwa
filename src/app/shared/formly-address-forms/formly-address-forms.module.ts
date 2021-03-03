import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { FormlyAddressFormComponent } from './components/formly-address-form/formly-address-form.component';
import { FormlyCustomerAddressFormComponent } from './components/formly-customer-address-form/formly-customer-address-form.component';
import {
  ADDRESS_FORM_CONFIGURATION,
  AddressFormConfigurationProvider,
} from './configurations/address-form-configuration.provider';
import { AddressFormDEConfiguration } from './configurations/de/address-form-de.configuration';
import { AddressFormDefaultConfiguration } from './configurations/default/address-form-default.configuration';
import { AddressFormFRConfiguration } from './configurations/fr/address-form-fr.configuration';
import { AddressFormGBConfiguration } from './configurations/gb/address-form-gb.configuration';
import { AddressFormUSConfiguration } from './configurations/us/address-form-us.configuration';

@NgModule({
  imports: [CommonModule, FormlyModule, FormsSharedModule, ReactiveFormsModule, TranslateModule],
  declarations: [FormlyAddressFormComponent, FormlyCustomerAddressFormComponent],
  exports: [FormlyAddressFormComponent, FormlyCustomerAddressFormComponent],
  providers: [
    AddressFormConfigurationProvider,
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormDEConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormDefaultConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormUSConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormFRConfiguration, multi: true },
    { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormGBConfiguration, multi: true },
  ],
})
export class FormlyAddressFormsModule {}
