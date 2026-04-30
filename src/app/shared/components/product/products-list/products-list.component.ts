import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import Swiper from 'swiper';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import {
  LARGE_BREAKPOINT_WIDTH,
  MEDIUM_BREAKPOINT_WIDTH,
  SMALL_BREAKPOINT_WIDTH,
} from 'ish-core/configurations/injection-keys';
import { ProductContextDisplayProperties } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { InjectSingle } from 'ish-core/utils/injection';
import { ProductItemDisplayType } from 'ish-shared/components/product/product-item/product-item.component';

@Component({
  selector: 'ish-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) productSKUs: string[];
  @Input() listStyle: string;
  @Input() slideItems: number;
  @Input() listItemStyle: ProductItemDisplayType;
  @Input() listItemCSSClass: string;
  @Input() listItemConfiguration: Partial<ProductContextDisplayProperties>;

  productSKUs$: Observable<string[]>;

  private swiper: Swiper;
  private swiperInitialized = false;

  @ViewChild('swiper') set swiperRef(ref: ElementRef) {
    if (ref && !this.swiperInitialized && !SSR) {
      this.swiperInitialized = true;
      const swiperEl = ref.nativeElement;
      this.swiper = new Swiper(swiperEl, {
        modules: [A11y, Navigation, Pagination],
        ...this.swiperConfig,
        navigation: {
          nextEl: swiperEl.querySelector('.swiper-button-next'),
          prevEl: swiperEl.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: swiperEl.querySelector('.swiper-pagination'),
          clickable: true,
        },
      });
    }
  }

  // configuration of swiper carousel: https://swiperjs.com/swiper-api
  private swiperConfig: SwiperOptions = {
    watchSlidesProgress: true,
    direction: 'horizontal',
    breakpoints: {},
  };

  constructor(
    @Inject(SMALL_BREAKPOINT_WIDTH) private smallBreakpointWidth: InjectSingle<typeof SMALL_BREAKPOINT_WIDTH>,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: InjectSingle<typeof MEDIUM_BREAKPOINT_WIDTH>,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: InjectSingle<typeof LARGE_BREAKPOINT_WIDTH>,
    private shoppingFacade: ShoppingFacade
  ) {}

  ngOnChanges(): void {
    this.configureSlides(this.slideItems);

    // remove all SKUs from the productSKUs Array that are also contained in the failed products Array
    this.productSKUs$ = combineLatest([of(this.productSKUs), this.shoppingFacade.failedProducts$]).pipe(
      distinctUntilChanged<[string[], string[]]>(isEqual),
      map(([skus, failed]) => skus.filter(x => !failed.includes(x)))
    );

    // update swiper when slides change
    this.swiper?.update();
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  /**
   * Configure Swiper slidesPerView/slidesPerGroup settings
   * with breakpoint responsive design considerations based on the given slide items.
   *
   * @param slideItems The amount of slide items that should be rendered if enough screen space is available.
   */
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
