import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';

import { fetchSharedWishlistGuard } from '../guards/fetch-shared-wishlist.guard';
import { provideWishlistsStore } from '../store/wishlists-store.providers';

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
