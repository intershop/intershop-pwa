import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
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
  itemsPerSlide = 4;
  /**
   * configuration of swiper carousel
   * find possible parameters here: http://idangero.us/swiper/api/#parameters
   */
  swiperConfig: SwiperConfigInterface;

  tileConfiguration: Partial<ProductContextDisplayProperties>;

  constructor(private wishlistsFacade: WishlistsFacade, @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number) {
    this.tileConfiguration = {
      addToWishlist: false,
      addToOrderTemplate: false,
      addToCompare: false,
      addToQuote: false,
    };

    this.swiperConfig = {
      breakpoints: {
        [largeBreakpointWidth]: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        clickableClass: 'swiper-pagination-clickable',
      },
      slidesPerView: 2,
      slidesPerGroup: 2,
    };
  }

  ngOnInit() {
    this.allWishlistsItemsSkus$ = this.wishlistsFacade.allWishlistsItemsSkus$;
  }
}
