import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../../wishlists/select-wishlist-modal/select-wishlist-modal.component';

@Component({
  selector: 'ish-product-add-to-wishlist',
  templateUrl: './product-add-to-wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Wishlist Component adds a product to a wishlist.
 *
 * @example
 * <ish-product-add-to-wishlist
 *               [product]=product
 *               displayType="icon"
 * ></ish-product-add-to-wishlist>
 */
export class ProductAddToWishlistComponent {
  @Input() product: Product;
  @Input() displayType?: 'icon' | 'link' | 'animated' = 'link';

  constructor(private wishlistsFacade: WishlistsFacade, private accountFacade: AccountFacade, private router: Router) {}

  /**
   * if the user is not logged in display login dialog, else open select wishlist dialog
   */
  openModal(modal: SelectWishlistModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'wishlists' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  addProductToWishlist(wishlist: { id: string; title: string }) {
    if (!wishlist.id) {
      this.wishlistsFacade.addProductToNewWishlist(wishlist.title, this.product.sku);
    } else {
      this.wishlistsFacade.addProductToWishlist(wishlist.id, this.product.sku);
    }
  }
}
