import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToWishlistComponent } from './shared/product-add-to-wishlist/product-add-to-wishlist.component';
import { SelectWishlistModalComponent } from './shared/select-wishlist-modal/select-wishlist-modal.component';
import { WishlistPreferencesDialogComponent } from './shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistWidgetComponent } from './shared/wishlist-widget/wishlist-widget.component';
import { WishlistsLinkComponent } from './shared/wishlists-link/wishlists-link.component';

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
})
export class WishlistsModule {}
