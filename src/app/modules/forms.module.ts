import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { SelectRegionComponent } from './../shared/components/form-controls/select-region/select-region.component';
import { SelectTitleComponent } from './../shared/components/form-controls/select-title/select-title.component';
import { AddressDeComponent } from './../shared/components/forms/address-form/address-de/address-de.component';
import { AddressDefaultComponent } from './../shared/components/forms/address-form/address-default/address-default.component';
import { AddressFormComponent } from './../shared/components/forms/address-form/address-form.component';
import { AddressFrComponent } from './../shared/components/forms/address-form/address-fr/address-fr.component';
import { AddressUsComponent } from './../shared/components/forms/address-form/address-us/address-us.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AddressDeComponent,
    AddressDefaultComponent,
    AddressFormComponent,
    AddressFrComponent,
    AddressUsComponent,
    SelectRegionComponent,
    SelectTitleComponent
  ],
  exports: [
    AddressFormComponent,
    SelectRegionComponent,
    SelectTitleComponent
  ]
})
export class FormsModule { }
