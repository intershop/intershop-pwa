import { ADDRESS_FORM_FACTORY } from './address-form.factory';

import { AddressFormDEComponent } from './address-form-de/address-form-de.component';
import { AddressFormDefaultComponent } from './address-form-default/address-form-default.component';
import { AddressFormFRComponent } from './address-form-fr/address-form-fr.component';
import { AddressFormGBComponent } from './address-form-gb/address-form-gb.component';
import { AddressFormUSComponent } from './address-form-us/address-form-us.component';
import { AddressFormComponent } from './address-form.component';

import { AddressFormDEFactory } from './address-form-de/address-form-de.factory';
import { AddressFormDefaultFactory } from './address-form-default/address-form-default.factory';
import { AddressFormFRFactory } from './address-form-fr/address-form-fr.factory';
import { AddressFormGBFactory } from './address-form-gb/address-form-gb.factory';
import { AddressFormUSFactory } from './address-form-us/address-form-us.factory';

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
