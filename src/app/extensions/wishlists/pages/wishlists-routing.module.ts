import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-wishlist/account-wishlist-page.module').then(m => m.AccountWishlistPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'wishlists', breadcrumbData: [{ key: 'account.wishlists.breadcrumb_link' }] },
  },
  {
    path: ':wishlistName',
    loadChildren: () =>
      import('./account-wishlist-detail/account-wishlist-detail-page.module').then(
        m => m.AccountWishlistDetailPageModule
      ),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'wishlists' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistsRoutingModule {}
