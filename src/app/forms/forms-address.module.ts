import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { components, factoryProviders } from './address/components';
import { CustomerAddressFormComponent } from './address/components/customer-address-form/customer-address-form.component';
import { AddressFormFactoryProvider } from './address/configurations/address-form-factory.provider';
import { FormsSharedModule } from './forms-shared.module';

@NgModule({
  imports: [CommonModule, FormsSharedModule, ReactiveFormsModule, SharedModule],
  declarations: [...components, CustomerAddressFormComponent],
  exports: [...components, CustomerAddressFormComponent, FormsSharedModule],
  providers: [AddressFormFactoryProvider, ...factoryProviders],
})
export class FormsAddressModule {}
