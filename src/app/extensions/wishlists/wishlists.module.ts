import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToWishlistComponent } from './shared/product/product-add-to-wishlist/product-add-to-wishlist.component';
import { SelectWishlistModalComponent } from './shared/wishlists/select-wishlist-modal/select-wishlist-modal.component';
import { WishlistPreferencesDialogComponent } from './shared/wishlists/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistsLinkComponent } from './shared/wishlists/wishlists-link/wishlists-link.component';
import { WishlistsStoreModule } from './store/wishlists-store.module';

@NgModule({
  imports: [SharedModule, WishlistsStoreModule],
  declarations: [
    ProductAddToWishlistComponent,
    SelectWishlistModalComponent,
    WishlistPreferencesDialogComponent,
    WishlistsLinkComponent,
  ],
  exports: [SelectWishlistModalComponent, WishlistPreferencesDialogComponent],
  entryComponents: [ProductAddToWishlistComponent, WishlistsLinkComponent],
})
export class WishlistsModule {}
