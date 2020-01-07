import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { once } from 'lodash-es';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../../models/wishlist/wishlist.model';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-account-wishlist-detail-line-item',
  templateUrl: './account-wishlist-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailLineItemComponent implements OnChanges {
  constructor(private productFacade: ShoppingFacade, private wishlistsFacade: WishlistsFacade) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() wishlistItemData: WishlistItem;
  @Input() currentWishlist: Wishlist;
  @Input() allWishlists: Wishlist[];

  addToCartForm: FormGroup;
  product$: Observable<ProductView>;

  /** init form in the beginning */
  private initForm = once(() => {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(1),
    });
  });

  ngOnChanges(s: SimpleChanges) {
    this.initForm();
    if (s.wishlistItemData) {
      this.loadProductDetails();
    }
  }

  addToCart(sku: string) {
    this.productFacade.addProductToBasket(sku, Number(this.addToCartForm.get('quantity').value));
  }

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

  /**if the wishlistItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.productFacade.product$(
        this.wishlistItemData.sku,
        AccountWishlistDetailLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );
    }
  }
}
