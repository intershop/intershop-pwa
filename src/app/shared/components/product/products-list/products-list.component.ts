import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';
import SwiperCore, { Navigation, Pagination, SwiperOptions } from 'swiper';

import {
  LARGE_BREAKPOINT_WIDTH,
  MEDIUM_BREAKPOINT_WIDTH,
  SMALL_BREAKPOINT_WIDTH,
} from 'ish-core/configurations/injection-keys';
import { ProductItemDisplayType } from 'ish-shared/components/product/product-item/product-item.component';

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'ish-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnChanges {
  @Input() productSKUs: string[];
  @Input() listStyle: string;
  @Input() slideItems: number;
  @Input() listItemStyle: ProductItemDisplayType;
  @Input() listItemCSSClass: string;

  /**
   * configuration of swiper carousel
   * https://swiperjs.com/swiper-api
   */
  swiperConfig: SwiperOptions;

  constructor(
    @Inject(SMALL_BREAKPOINT_WIDTH) private smallBreakpointWidth: number,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number
  ) {
    this.swiperConfig = {
      direction: 'horizontal',
      navigation: true,
      pagination: {
        clickable: true,
      },
      observer: true,
      observeParents: true,
    };
  }

  ngOnChanges(): void {
    this.configureSlides(this.slideItems);
  }

  /**
   * Configure Swiper slidesPerView/slidesPerGroup settings
   * with breakpoint responsive design considerations based on the given slide items.
   *
   * @param slideItems The amount of slide items that should be rendered if enough screen space is available.
   */
  configureSlides(slideItems: number) {
    switch (slideItems) {
      case 1: {
        this.swiperConfig.breakpoints = {
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
        };
        break;
      }
      case 2: {
        this.swiperConfig.breakpoints = {
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          [this.smallBreakpointWidth]: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
        };
        break;
      }
      case 3: {
        this.swiperConfig.breakpoints = {
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          [this.smallBreakpointWidth]: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          [this.mediumBreakpointWidth]: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        };
        break;
      }
      default: {
        this.swiperConfig.breakpoints = {
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          [this.smallBreakpointWidth]: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          [this.mediumBreakpointWidth]: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          [this.largeBreakpointWidth]: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        };
      }
    }
  }
}
