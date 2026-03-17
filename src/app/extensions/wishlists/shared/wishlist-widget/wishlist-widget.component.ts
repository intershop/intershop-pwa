import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

/**
 * The Wishlist Widget Component displays all unique items from all wish lists.
 */
@Component({
  selector: 'ish-wishlist-widget',
  templateUrl: './wishlist-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ProductsListComponent, TranslatePipe, RouterLink],
})
export class WishlistWidgetComponent implements OnInit {
  allWishlistsItemsSkus$: Observable<string[]>;
  tileConfiguration: Partial<ProductContextDisplayProperties>;

  constructor(private wishlistsFacade: WishlistsFacade, private shoppingFacade: ShoppingFacade) {
    this.tileConfiguration = {
      addToWishlist: false,
      addToOrderTemplate: false,
      addToCompare: false,
      addToQuote: false,
    };
  }

  ngOnInit() {
    this.allWishlistsItemsSkus$ = this.shoppingFacade.excludeFailedProducts$(
      this.wishlistsFacade.allWishlistsItemsSkus$
    );
  }
}
