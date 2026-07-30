import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreLocatorModule } from '../../store-locator.module';
import { StoreLocatorStoreModule } from '../../store/store-locator-store.module';

import { StoreLocatorPageComponent } from './store-locator-page.component';

const storeLocatorPageRoutes: Routes = [{ path: '', component: StoreLocatorPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(storeLocatorPageRoutes), StoreLocatorModule, StoreLocatorStoreModule],
  declarations: [StoreLocatorPageComponent],
})
export class StoreLocatorPageModule {}
