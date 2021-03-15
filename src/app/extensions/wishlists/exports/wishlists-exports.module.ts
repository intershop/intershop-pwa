import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyProductAddToWishlistComponent } from './lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { LazyWishlistWidgetComponent } from './lazy-wishlist-widget/lazy-wishlist-widget.component';
import { LazyWishlistsLinkComponent } from './lazy-wishlists-link/lazy-wishlists-link.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'wishlists',
        location: () => import('../store/wishlists-store.module').then(m => m.WishlistsStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [LazyProductAddToWishlistComponent, LazyWishlistWidgetComponent, LazyWishlistsLinkComponent],
  exports: [LazyProductAddToWishlistComponent, LazyWishlistWidgetComponent, LazyWishlistsLinkComponent],
})
export class WishlistsExportsModule {}
