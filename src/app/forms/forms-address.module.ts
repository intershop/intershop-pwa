import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { FormsSharedModule } from '../shared/forms/forms.module';

import { components, factoryProviders } from './address/components';
import { CustomerAddressFormComponent } from './address/components/customer-address-form/customer-address-form.component';
import { AddressFormFactoryProvider } from './address/configurations/address-form-factory.provider';

@NgModule({
  imports: [CommonModule, FormsSharedModule, IconModule, NgbPopoverModule, ReactiveFormsModule, TranslateModule],
  declarations: [...components, CustomerAddressFormComponent],
  exports: [...components, CustomerAddressFormComponent],
  providers: [AddressFormFactoryProvider, ...factoryProviders],
})
export class FormsAddressModule {}
