import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';
import { SelectWishlistModalComponent } from '../select-wishlist-modal/select-wishlist-modal.component';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-wishlist-line-item',
  templateUrl: './wishlist-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ProductContextAccessDirective,
    SelectWishlistModalComponent,
    DatePipe,
    ProductImageComponent,
    ProductNameComponent,
    ProductVariationDisplayComponent,
    ProductIdComponent,
    ProductBundleDisplayComponent,
    TranslatePipe,
    ProductPriceComponent,
    ProductQuantityComponent,
    ProductAddToBasketComponent,
  ],
})
export class WishlistLineItemComponent {
  constructor(private wishlistsFacade: WishlistsFacade) {}

  @Input({ required: true }) wishlistItemData: WishlistItem;
  @Input({ required: true }) currentWishlist: Wishlist;
  @Input() readOnly = false;

  moveItemToOtherWishlist(sku: string, wishlistMoveData: { id: string; title: string }) {
    if (wishlistMoveData.id) {
      this.wishlistsFacade.moveItemToWishlist(this.currentWishlist.id, wishlistMoveData.id, sku);
    } else {
      this.wishlistsFacade.moveItemToNewWishlist(this.currentWishlist.id, wishlistMoveData.title, sku);
    }
  }

  removeProductFromWishlist(sku: string) {
    this.wishlistsFacade.removeProductFromWishlist(this.currentWishlist.id, sku);
  }
}
