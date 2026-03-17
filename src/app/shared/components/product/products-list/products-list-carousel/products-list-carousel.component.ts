import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';
import SwiperCore, { A11y, Navigation, Pagination } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { SwiperOptions } from 'swiper/types';

import {
  LARGE_BREAKPOINT_WIDTH,
  MEDIUM_BREAKPOINT_WIDTH,
  SMALL_BREAKPOINT_WIDTH,
} from 'ish-core/configurations/injection-keys';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { InjectSingle } from 'ish-core/utils/injection';
import {
  ProductItemComponent,
  ProductItemDisplayType,
} from 'ish-shared/components/product/product-item/product-item.component';

SwiperCore.use([Pagination, Navigation, A11y]);

@Component({
  selector: 'ish-products-list-carousel',
  templateUrl: './products-list-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, ProductItemComponent, ProductContextDirective, SwiperModule],
})
export class ProductsListCarouselComponent implements OnChanges {
  @Input({ required: true }) products: string[];
  @Input() slideItems: number;
  @Input() listItemStyle: ProductItemDisplayType;
  @Input() listItemCSSClass: string;
  @Input() listItemConfiguration: Partial<ProductContextDisplayProperties>;

  private fetchedSKUs = new Set<string>();

  swiperConfig: SwiperOptions = {
    watchSlidesProgress: true,
    direction: 'horizontal',
    navigation: true,
    pagination: {
      clickable: true,
    },
    observer: true,
    observeParents: true,
  };

  constructor(
    @Inject(SMALL_BREAKPOINT_WIDTH) private smallBreakpointWidth: InjectSingle<typeof SMALL_BREAKPOINT_WIDTH>,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: InjectSingle<typeof MEDIUM_BREAKPOINT_WIDTH>,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: InjectSingle<typeof LARGE_BREAKPOINT_WIDTH>
  ) {}

  ngOnChanges(): void {
    this.configureSlides(this.slideItems);
  }

  lazyFetch(fetch: boolean, sku: string): boolean {
    if (fetch) {
      this.fetchedSKUs.add(sku);
    }
    return this.fetchedSKUs.has(sku);
  }

  private configureSlides(slideItems: number) {
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
