import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./store-locator/store-locator-page.component').then(m => m.StoreLocatorPageComponent),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'storeLocator',
      meta: {
        title: 'store_locator.title',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class StoreLocatorRoutingModule {}
