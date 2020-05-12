import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyWishlistWidgetComponent } from './account/lazy-wishlist-widget/lazy-wishlist-widget.component';
import { LazyProductAddToWishlistComponent } from './product/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { LazyWishlistsLinkComponent } from './wishlists/lazy-wishlists-link/lazy-wishlists-link.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'wishlists', location: import('../wishlists.module') },
      multi: true,
    },
  ],
  declarations: [LazyProductAddToWishlistComponent, LazyWishlistWidgetComponent, LazyWishlistsLinkComponent],
  exports: [LazyProductAddToWishlistComponent, LazyWishlistWidgetComponent, LazyWishlistsLinkComponent],
})
export class WishlistsExportsModule {}
