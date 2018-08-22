import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { components, factoryProviders } from './address/components';
import { AddressFormFactoryProvider } from './address/configurations/address-form-factory.provider';
import { FormsSharedModule } from './forms-shared.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, FormsSharedModule],
  declarations: [...components],
  exports: [...components, FormsSharedModule],
  providers: [AddressFormFactoryProvider, ...factoryProviders],
})
export class FormsAddressModule {}
