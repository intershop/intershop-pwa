import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToWishlistComponent } from './shared/product-add-to-wishlist/product-add-to-wishlist.component';
import { SelectWishlistFormComponent } from './shared/select-wishlist-form/select-wishlist-form.component';
import { SelectWishlistModalComponent } from './shared/select-wishlist-modal/select-wishlist-modal.component';
import { WishlistPreferencesDialogComponent } from './shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistShareDialogComponent } from './shared/wishlist-share-dialog/wishlist-share-dialog.component';
import { WishlistWidgetComponent } from './shared/wishlist-widget/wishlist-widget.component';
import { WishlistsLinkComponent } from './shared/wishlists-link/wishlists-link.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductAddToWishlistComponent,
    SelectWishlistFormComponent,
    SelectWishlistModalComponent,
    WishlistPreferencesDialogComponent,
    WishlistShareDialogComponent,
    WishlistsLinkComponent,
    WishlistWidgetComponent,
  ],
  exports: [SelectWishlistModalComponent, WishlistPreferencesDialogComponent, WishlistShareDialogComponent],
})
export class WishlistsModule {}
