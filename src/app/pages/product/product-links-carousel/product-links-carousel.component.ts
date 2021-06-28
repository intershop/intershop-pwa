import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

SwiperCore.use([Navigation, Pagination]);

/**
 * The Product Link Carousel Component
 *
 * Displays the products which are assigned to a specific product link type as an carousel.
 * It uses the {@link ProductItemContainerComponent} for the rendering of products.
 *
 * @example
 * <ish-product-links-carousel [links]="links.crossselling" [productLinkTitle]="'product.product_links.crossselling.title' | translate"></ish-product-links-carousel>
 */
@Component({
  selector: 'ish-product-links-carousel',
  templateUrl: './product-links-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLinksCarouselComponent implements OnChanges {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() links: ProductLinks;
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;
  /**
   * display only available products if set to 'true'
   */
  @Input() displayOnlyAvailableProducts = false;

  productSKUs$: Observable<string[]>;

  /**
   * configuration of swiper carousel
   * https://swiperjs.com/swiper-api
   */
  swiperConfig: SwiperOptions;

  constructor(
    @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: number,
    private shoppingFacade: ShoppingFacade
  ) {
    this.swiperConfig = {
      direction: 'horizontal',
      navigation: true,
      pagination: {
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        [mediumBreakpointWidth]: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        [largeBreakpointWidth]: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
      },
    };
  }

  ngOnChanges() {
    this.productSKUs$ = this.displayOnlyAvailableProducts
      ? combineLatest(
          this.links.products.map(sku => this.shoppingFacade.product$(sku, ProductCompletenessLevel.List))
        ).pipe(map(products => products.filter(p => p.available).map(p => p.sku)))
      : of(this.links.products);
  }
}
