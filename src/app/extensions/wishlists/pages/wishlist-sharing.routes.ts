import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { fetchSharedWishlistGuard } from '../guards/fetch-shared-wishlist.guard';
import { provideWishlistsStore } from '../store/wishlists-store.module';

export const routes: Routes = [
  {
    path: ':wishlistId',
    loadComponent: () =>
      import('./shared-wishlist/shared-wishlist-page.component').then(m => m.SharedWishlistPageComponent),
    canActivate: [featureToggleGuard, fetchSharedWishlistGuard],
    data: { feature: 'wishlists' },
    providers: [provideWishlistsStore()],
  },
];
