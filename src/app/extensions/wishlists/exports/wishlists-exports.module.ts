import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyProductAddToWishlistComponent } from './lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { LazyWishlistWidgetComponent } from './lazy-wishlist-widget/lazy-wishlist-widget.component';
import { LazyWishlistsLinkComponent } from './lazy-wishlists-link/lazy-wishlists-link.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('wishlists', true, {
      location: () => import('../store/wishlists-store.module').then(m => m.WishlistsStoreModule),
    }),
  ],
  declarations: [LazyProductAddToWishlistComponent, LazyWishlistsLinkComponent, LazyWishlistWidgetComponent],
  exports: [LazyProductAddToWishlistComponent, LazyWishlistsLinkComponent, LazyWishlistWidgetComponent],
})
export class WishlistsExportsModule {}
