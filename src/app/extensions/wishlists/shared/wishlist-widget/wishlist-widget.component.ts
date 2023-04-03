import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { WishlistsFacade } from '../../facades/wishlists.facade';

/**
 * The Wishlist Widget Component displays all unique items from all wish lists.
 */
@Component({
  selector: 'ish-wishlist-widget',
  templateUrl: './wishlist-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class WishlistWidgetComponent implements OnInit {
  allWishlistsItemsSkus$: Observable<string[]>;
  tileConfiguration: Partial<ProductContextDisplayProperties>;

  constructor(private wishlistsFacade: WishlistsFacade) {
    this.tileConfiguration = {
      addToWishlist: false,
      addToOrderTemplate: false,
      addToCompare: false,
      addToQuote: false,
    };
  }

  ngOnInit() {
    this.allWishlistsItemsSkus$ = this.wishlistsFacade.allWishlistsItemsSkus$;
  }
}
