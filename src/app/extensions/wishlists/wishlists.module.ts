import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToWishlistComponent } from './shared/product-add-to-wishlist/product-add-to-wishlist.component';
import { SelectWishlistFormComponent } from './shared/select-wishlist-form/select-wishlist-form.component';
import { SelectWishlistModalComponent } from './shared/select-wishlist-modal/select-wishlist-modal.component';
import { WishlistLineItemComponent } from './shared/wishlist-line-item/wishlist-line-item.component';
import { WishlistPreferencesDialogComponent } from './shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistSharingDialogComponent } from './shared/wishlist-sharing-dialog/wishlist-sharing-dialog.component';
import { WishlistWidgetComponent } from './shared/wishlist-widget/wishlist-widget.component';
import { WishlistsLinkComponent } from './shared/wishlists-link/wishlists-link.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductAddToWishlistComponent,
    SelectWishlistFormComponent,
    SelectWishlistModalComponent,
    WishlistLineItemComponent,
    WishlistPreferencesDialogComponent,
    WishlistSharingDialogComponent,
    WishlistsLinkComponent,
    WishlistWidgetComponent,
  ],
  exports: [
    SelectWishlistModalComponent,
    WishlistLineItemComponent,
    WishlistPreferencesDialogComponent,
    WishlistSharingDialogComponent,
  ],
})
export class WishlistsModule {}
