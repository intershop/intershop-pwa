import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist Widget Component displays wishlist products.
 * If a preferred wishlist exists, the products of the preferred wishlist are shown.
 * Otherwise the products of all wishlists are displayed.
 */
@Component({
  selector: 'ish-wishlist-widget',
  standalone: false,
  templateUrl: './wishlist-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class WishlistWidgetComponent implements OnInit {
  preferredWishlist$: Observable<Wishlist>;
  wishlistItemsSkus$: Observable<string[]>;
  tileConfiguration: Partial<ProductContextDisplayProperties>;

  constructor(
    private wishlistsFacade: WishlistsFacade,
    private shoppingFacade: ShoppingFacade
  ) {
    this.tileConfiguration = {
      addToWishlist: false,
      addToOrderTemplate: false,
      addToCompare: false,
      addToQuote: false,
    };
  }

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistsFacade.preferredWishlist$;
    this.wishlistItemsSkus$ = this.shoppingFacade.excludeFailedProducts$(this.extractProductSKUsFromWishlists$());
  }

  /**
   * Returns an observable of unique product SKUs to display.
   * If a preferred wishlist exists, only its products are shown, otherwise the products of all wishlists.
   */
  private extractProductSKUsFromWishlists$(): Observable<string[]> {
    return this.wishlistsFacade.preferredWishlist$.pipe(
      switchMap(preferredWishlist => this.wishlistsFacade.wishlistItemsSkus$(preferredWishlist?.id))
    );
  }
}
