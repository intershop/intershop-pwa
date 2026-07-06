import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, filter, map, switchMap, tap } from 'rxjs';

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
  wishlistName: string;
  productSKUs$: Observable<string[]>;
  tileConfiguration: Partial<ProductContextDisplayProperties>;
  private loadingWishlistDetails = false;
  private wishlistSelectionStrategy: 'all' | 'latest' | 'preferred' = 'all';

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
    this.productSKUs$ = this.shoppingFacade.excludeFailedProducts$(this.extractProductSKUsFromWishlists$());
  }

  /**
   * Returns an observable of unique product SKUs based on the selected wishlist strategy.
   * Triggers `loadWishlistDetails` via `tap` if item details are not yet loaded.
   */
  private extractProductSKUsFromWishlists$(): Observable<string[]> {
    return this.wishlistsFacade.wishlists$.pipe(
      this.filterWishlistsForSelectionStrategy(),
      tap(wishlists => this.ensureDetailsLoaded(wishlists)),
      switchMap(wishlists => this.wishlistsFacade.allWishlistsItemsSkus$(wishlists.map(w => w.id)))
    );
  }

  private filterWishlistsForSelectionStrategy(): (source$: Observable<Wishlist[]>) => Observable<Wishlist[]> {
    return (source$: Observable<Wishlist[]>) =>
      source$.pipe(
        filter(wishlists => !!wishlists?.length),
        map(wishlists => {
          switch (this.wishlistSelectionStrategy) {
            case 'preferred': {
              const preferred = wishlists.filter(w => w.preferred);
              return preferred.length
                ? preferred
                : [[...wishlists].sort((a, b) => (b.creationDate ?? 0) - (a.creationDate ?? 0))[0]];
            }
            case 'latest':
              return [[...wishlists].sort((a, b) => (b.creationDate ?? 0) - (a.creationDate ?? 0))[0]];
            default:
              return wishlists;
          }
        }),
        tap(wishlists => {
          this.wishlistName = wishlists.length === 1 ? wishlists[0]?.title : undefined;
        })
      );
  }

  private ensureDetailsLoaded(wishlists: Wishlist[]): void {
    if (!this.loadingWishlistDetails) {
      const idsToLoad = wishlists.filter(w => w.itemsCount !== w.items?.length).map(w => w.id);
      if (idsToLoad.length) {
        this.loadingWishlistDetails = true;
        this.wishlistsFacade.loadWishlistDetails(idsToLoad);
      }
    }
  }
}
