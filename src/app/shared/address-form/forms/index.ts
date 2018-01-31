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

const factories = [
  AddressFormDefaultFactory,
  AddressFormDEFactory,
  AddressFormFRFactory,
  AddressFormGBFactory,
  AddressFormUSFactory,
];

/**********************************/

export const factoryProviders = factories.map(f => (
  { provide: ADDRESS_FORM_FACTORY, useClass: f, multi: true }
));
