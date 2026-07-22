import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { StoreAddressComponent } from './shared/store-address/store-address.component';
import { StoresMapComponent } from './shared/stores-map/stores-map.component';

@NgModule({
  declarations: [StoreAddressComponent, StoresMapComponent],
  imports: [SharedModule],
  exports: [SharedModule, StoreAddressComponent, StoresMapComponent],
})
export class StoreLocatorModule {}
