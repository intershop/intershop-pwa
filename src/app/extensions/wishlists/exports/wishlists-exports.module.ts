import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyWishlistWidgetComponent } from './account/lazy-wishlist-widget/lazy-wishlist-widget.component';
import { LazyProductAddToWishlistComponent } from './products/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { LazyWishlistLinkComponent } from './wishlists/lazy-wishlist-link/lazy-wishlist-link.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-wishlists',
      loadChildren: () => import('../wishlists.module').then(m => m.WishlistsModule),
    }),
  ],
  declarations: [LazyProductAddToWishlistComponent, LazyWishlistLinkComponent, LazyWishlistWidgetComponent],
  exports: [LazyProductAddToWishlistComponent, LazyWishlistLinkComponent, LazyWishlistWidgetComponent],
})
export class WishlistsExportsModule {}
