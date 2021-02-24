import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';

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
export class ProductLinksCarouselComponent {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() links: ProductLinks;
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;

  /**
   * configuration of swiper carousel
   * find possible parameters here: http://idangero.us/swiper/api/#parameters
   */
  swiperConfig: SwiperOptions;

  constructor(
    @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: number
  ) {
    this.swiperConfig = {
      direction: 'horizontal',
      keyboard: true,
      mousewheel: false,
      navigation: true,
      scrollbar: false,
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
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        clickableClass: 'swiper-pagination-clickable',
      },
    };
  }
}
