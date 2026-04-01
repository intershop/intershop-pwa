import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, filter, map, tap } from 'rxjs';

import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist Widget Component displays all unique items from wish lists.
 * The displayed items can be controlled via the `wishlistSelectionStrategy` input.
 */
@Component({
  selector: 'ish-wishlist-widget',
  standalone: false,
  templateUrl: './wishlist-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class WishlistWidgetComponent implements OnInit {
  // Determines which wishlists are used to display products
  @Input() wishlistSelectionStrategy: 'all' | 'preferred' | 'latest' = 'all';
  wishlistName: string;
  allWishlistsItemsSkus$: Observable<string[]>;
  tileConfiguration: Partial<ProductContextDisplayProperties>;
  private loadingWishlistDetails = false;
  private wishlistsLoaded = false;

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
    this.allWishlistsItemsSkus$ = this.shoppingFacade.excludeFailedProducts$(
      this.wishlistsItemsSkusForSelectionStrategy$()
    );
  }

  /**
   * Necessary to set a default value for the input in case it is not set by the consumer.
   */
  getWishlistSelectionStrategy(): 'all' | 'preferred' | 'latest' {
    return this.wishlistSelectionStrategy ?? 'all';
  }

  /**
   * Returns an observable of product SKUs based on the selected wishlist strategy.
   * - `preferred`: Only SKUs from the preferred wishlist (falls back to latest wishlist if none is preferred).
   * - `latest`: Only SKUs from the most recently created wishlist.
   * - `all` (default): SKUs from all wishlists combined.
   * If a wishlist's item details are not yet loaded, `loadWishlistDetails` is triggered.
   */
  private wishlistsItemsSkusForSelectionStrategy$(): Observable<string[]> {
    return this.wishlistsFacade.wishlists$.pipe(
      tap(wishlists => {
        if (!wishlists?.length && !this.wishlistsLoaded) {
          this.wishlistsFacade.loadWishlists();
          this.wishlistsLoaded = true;
        }
      }),
      filter(wishlists => !!wishlists?.length),
      map(wishlists => this.getProductSkus(wishlists))
    );
  }

  private getProductSkus(wishlists: Wishlist[]): string[] {
    let selectedWishLists: Wishlist[] = [];
    switch (this.getWishlistSelectionStrategy()) {
      case 'preferred': {
        const preferred = wishlists.find(w => w.preferred);
        if (preferred) {
          if (preferred.itemsCount !== preferred.items?.length) {
            this.wishlistsFacade.loadWishlistDetails([preferred.id]);
          }
          this.wishlistName = preferred.title;
          selectedWishLists.push(preferred);
          break;
        }
        // falls through
      }
      case 'latest': {
        const sorted = [...wishlists].sort((a, b) => (b.creationDate ?? 0) - (a.creationDate ?? 0));
        if (sorted?.length > 0 && sorted[0].itemsCount !== sorted[0].items?.length) {
          this.wishlistsFacade.loadWishlistDetails([sorted[0].id]);
        }
        this.wishlistName = sorted[0]?.title;
        selectedWishLists.push(sorted[0]);
        break;
      }
      default: {
        if (!this.loadingWishlistDetails) {
          this.loadingWishlistDetails = true;
          this.wishlistsFacade.loadWishlistDetails(wishlists.map(w => w.id));
        }
        selectedWishLists = wishlists.filter(w => w.items?.length > 0);
        break;
      }
    }
    const skus = selectedWishLists.flatMap(w => w.items?.map(i => i.sku) ?? []) ?? [];
    return Array.from(new Set(skus));
  }
}
