import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { fetchSharedWishlistGuard } from '../guards/fetch-shared-wishlist.guard';

const routes: Routes = [
  {
    path: 'wishlists/:wishlistId',
    loadChildren: () => import('./shared-wishlist/shared-wishlist-page.module').then(m => m.SharedWishlistPageModule),
    canActivate: [featureToggleGuard, fetchSharedWishlistGuard],
    data: { feature: 'wishlists' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistSharingRoutingModule {}
