/* tslint:disable:no-barrel-files */
import { AddressFormDEComponent } from './address-form-de/address-form-de.component';
import { AddressFormDEFactory } from './address-form-de/address-form-de.factory';
import { AddressFormDefaultComponent } from './address-form-default/address-form-default.component';
import { AddressFormDefaultFactory } from './address-form-default/address-form-default.factory';
import { AddressFormFRComponent } from './address-form-fr/address-form-fr.component';
import { AddressFormFRFactory } from './address-form-fr/address-form-fr.factory';
import { AddressFormGBComponent } from './address-form-gb/address-form-gb.component';
import { AddressFormGBFactory } from './address-form-gb/address-form-gb.factory';
import { AddressFormUSComponent } from './address-form-us/address-form-us.component';
import { AddressFormUSFactory } from './address-form-us/address-form-us.factory';
import { AddressFormComponent } from './address-form/address-form.component';
import { ADDRESS_FORM_FACTORY } from './address-form/address-form.factory';

export const components = [
  AddressFormComponent,
  AddressFormDefaultComponent,
  AddressFormDEComponent,
  AddressFormFRComponent,
  AddressFormGBComponent,
  AddressFormUSComponent,
];

export const factoryProviders = [
  { provide: ADDRESS_FORM_FACTORY, useClass: AddressFormDefaultFactory, multi: true },
  { provide: ADDRESS_FORM_FACTORY, useClass: AddressFormDEFactory, multi: true },
  { provide: ADDRESS_FORM_FACTORY, useClass: AddressFormFRFactory, multi: true },
  { provide: ADDRESS_FORM_FACTORY, useClass: AddressFormGBFactory, multi: true },
  { provide: ADDRESS_FORM_FACTORY, useClass: AddressFormUSFactory, multi: true },
];
