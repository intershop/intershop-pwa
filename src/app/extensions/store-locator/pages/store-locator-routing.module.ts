import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

import { STORE_MAP_ICON_CONFIGURATION } from '../services/stores-map/stores-map.service';

const routes: Routes = [
  {
    path: 'store-finder',
    loadChildren: () => import('./store-locator/store-locator-page.module').then(m => m.StoreLocatorPageModule),
    canActivate: [FeatureToggleGuard],
    data: { feature: 'storeLocator' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: STORE_MAP_ICON_CONFIGURATION,
      useValue: {
        default:
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline_v4-2-medium.png,assets/icons/poi/tactile/pinlet_v4-2-medium.png,assets/icons/poi/quantum/pinlet/shoppingcart_pinlet-2-medium.png&highlight=4285f4,5491f5,ffffff?scale=1',
        highlight: undefined,
      },
    },
  ],
})
export class StoreLocatorRoutingModule {}
