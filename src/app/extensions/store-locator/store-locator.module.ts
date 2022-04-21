import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { StoreAddressComponent } from './shared/store-address/store-address.component';
import { StoreLocatorFooterComponent } from './shared/store-locator-footer/store-locator-footer.component';
import { StoresMapComponent } from './shared/stores-map/stores-map.component';

@NgModule({
  imports: [SharedModule],
  declarations: [StoreAddressComponent, StoreLocatorFooterComponent, StoresMapComponent],
  exports: [SharedModule, StoreAddressComponent, StoreLocatorFooterComponent, StoresMapComponent],
})
export class StoreLocatorModule {}
