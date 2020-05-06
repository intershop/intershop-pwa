import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistWidgetComponent } from './shared/account/wishlist-widget/wishlist-widget.component';
import { ProductAddToWishlistComponent } from './shared/product/product-add-to-wishlist/product-add-to-wishlist.component';
import { SelectWishlistModalComponent } from './shared/wishlists/select-wishlist-modal/select-wishlist-modal.component';
import { WishlistPreferencesDialogComponent } from './shared/wishlists/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistsLinkComponent } from './shared/wishlists/wishlists-link/wishlists-link.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductAddToWishlistComponent,
    SelectWishlistModalComponent,
    WishlistPreferencesDialogComponent,
    WishlistWidgetComponent,
    WishlistsLinkComponent,
  ],
  exports: [SelectWishlistModalComponent, WishlistPreferencesDialogComponent],
  entryComponents: [ProductAddToWishlistComponent, WishlistWidgetComponent, WishlistsLinkComponent],
})
export class WishlistsModule {}
