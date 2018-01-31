import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressFormService } from './address-form.service';
import { components, factoryProviders } from './forms';
import { AddressFormComponent } from './forms/address-form.component';

import { SharedModule } from '../shared.module';


@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  declarations: [...components],
  exports: [...components],
  providers: [AddressFormService, ...factoryProviders]
})
export class AddressFormModule { }
