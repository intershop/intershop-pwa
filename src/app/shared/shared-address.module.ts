import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AddressComponent } from './address/components/address/address.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [AddressComponent],
  exports: [AddressComponent],
})
export class SharedAddressModule {}
