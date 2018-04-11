import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { components, factoryProviders } from './address/components';
import { AddressFormService } from './address/services/address-form.service';

import { SharedModule } from '../shared/shared.module';
import { FormsSharedModule } from './forms-shared.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, FormsSharedModule],
  declarations: [...components],
  exports: [...components, FormsSharedModule],
  providers: [AddressFormService, ...factoryProviders],
})
export class FormsAddressModule {}
