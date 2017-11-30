import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { SelectCountryComponent } from './../shared/components/form-controls/select-country/select-country.component';
import { SelectRegionComponent } from './../shared/components/form-controls/select-region/select-region.component';
import { SelectTitleComponent } from './../shared/components/form-controls/select-title/select-title.component';
import { AddressDEComponent } from './../shared/components/forms/address-form/address-de/address-de.component';
import { AddressDefaultComponent } from './../shared/components/forms/address-form/address-default/address-default.component';
import { AddressFormComponent } from './../shared/components/forms/address-form/address-form.component';
import { AddressFRComponent } from './../shared/components/forms/address-form/address-fr/address-fr.component';
import { AddressGBComponent } from './../shared/components/forms/address-form/address-gb/address-gb.component';
import { AddressUSComponent } from './../shared/components/forms/address-form/address-us/address-us.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AddressDEComponent,
    AddressDefaultComponent,
    AddressFormComponent,
    AddressFRComponent,
    AddressGBComponent,
    AddressUSComponent,
    SelectCountryComponent,
    SelectRegionComponent,
    SelectTitleComponent
  ],
  exports: [
    AddressFormComponent,
    SelectCountryComponent,
    SelectRegionComponent,
    SelectTitleComponent
  ]
})
export class FormsModule { }
