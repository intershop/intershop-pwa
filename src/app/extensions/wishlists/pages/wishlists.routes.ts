import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';
import { authGuard } from 'ish-core/guards/auth.guard';

import { provideWishlistsStore } from '../store/wishlists-store.providers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-wishlist/account-wishlist-page.component').then(m => m.AccountWishlistPageComponent),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'wishlists', breadcrumbData: [{ key: 'account.wishlists.breadcrumb_link' }] },
    providers: [provideWishlistsStore()],
  },
  {
    path: ':wishlistName',
    loadComponent: () =>
      import('./account-wishlist-detail/account-wishlist-detail-page.component').then(
        m => m.AccountWishlistDetailPageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'wishlists' },
  },
];

