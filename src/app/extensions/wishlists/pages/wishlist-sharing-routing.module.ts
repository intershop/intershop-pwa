import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'wishlists',
    loadChildren: () => import('./wishlist/wishlist-page.module').then(m => m.WishlistPageModule),
    canActivate: [featureToggleGuard],
    data: { feature: 'wishlists' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistSharingRoutingModule {}
