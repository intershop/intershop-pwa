import { ADDRESS_FACTORY } from './address-form.factory';

import { AddressDEComponent } from './address-de/address-de.component';
import { AddressDefaultComponent } from './address-default/address-default.component';
import { AddressFormComponent } from './address-form.component';
import { AddressFRComponent } from './address-fr/address-fr.component';
import { AddressGBComponent } from './address-gb/address-gb.component';
import { AddressUSComponent } from './address-us/address-us.component';

import { AddressDEFactory } from './address-de/address-de.factory';
import { AddressDefaultFactory } from './address-default/address-default.factory';
import { AddressFRFactory } from './address-fr/address-fr.factory';
import { AddressGBFactory } from './address-gb/address-gb.factory';
import { AddressUSFactory } from './address-us/address-us.factory';

export const components = [
  AddressFormComponent,
  AddressDefaultComponent,
  AddressDEComponent,
  AddressFRComponent,
  AddressGBComponent,
  AddressUSComponent,
];

const factories = [
  AddressDefaultFactory,
  AddressDEFactory,
  AddressFRFactory,
  AddressGBFactory,
  AddressUSFactory,
];

/**********************************/

export const factoryProviders = factories.map(f => (
  { provide: ADDRESS_FACTORY, useClass: f, multi: true }
));
