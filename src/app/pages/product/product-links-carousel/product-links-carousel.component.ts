import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import Swiper from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { InjectSingle } from 'ish-core/utils/injection';
import { whenTruthy } from 'ish-core/utils/operators';
import { DeferredItemComponent } from 'ish-shared/components/common/deferred-item/deferred-item.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

/**
 * The Product Link Carousel Component
 *
 * Displays the products which are assigned to a specific product link type as an carousel.
 * It uses the {@link ProductItemComponent} for the rendering of products.
 *
 * @example
 * <ish-product-links-carousel [links]="links.crossselling" [productLinkTitle]="'product.product_links.crossselling.title' | translate" />
 */
@Component({
  selector: 'ish-product-links-carousel',
  templateUrl: './product-links-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
  providers: [RxState],
  standalone: true,
  imports: [
    SwiperModule,
    AsyncPipe,
    ProductItemComponent,
    ProductContextDirective,
    DeferredItemComponent,
    LazyLoadingContentDirective,
  ],
})
export class ProductLinksCarouselComponent implements OnDestroy {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input({ required: true }) set links(links: ProductLinks) {
    this.state.set('products', () => links.products);
  }
  /**
   * title that should displayed for the specific product link type
   */
  @Input({ required: true }) productLinkTitle: string;
  /**
   * display only available products if set to 'true'
   */
  @Input() set displayOnlyAvailableProducts(value: boolean) {
    this.state.set('displayOnlyAvailableProducts', () => value);
  }

  productSKUs$ = this.state.select('products$');
  isServerSideRendering = SSR;

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
    @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: InjectSingle<typeof LARGE_BREAKPOINT_WIDTH>,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: InjectSingle<typeof MEDIUM_BREAKPOINT_WIDTH>,
    private shoppingFacade: ShoppingFacade,
    private state: RxState<{
      products: string[];
      displayOnlyAvailableProducts: boolean;
      hiddenSlides: number[];
      products$: Observable<string>[];
    }>
  ) {
    this.state.set(() => ({
      hiddenSlides: [],
      displayOnlyAvailableProducts: false,
    }));

    this.swiperConfig.breakpoints = {
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
    };

    const filteredProducts$ = combineLatest([
      combineLatest([this.state.select('products'), this.state.select('displayOnlyAvailableProducts')]).pipe(
        map(([products, displayOnlyAvailableProducts]) => {
          // prepare lazy observables for all products
          if (displayOnlyAvailableProducts) {
            return products.map((sku, index) =>
              combineLatest([
                // make sure to load product and inventory data
                this.shoppingFacade.product$(sku, ProductCompletenessLevel.List).pipe(whenTruthy()),
                this.shoppingFacade.productInventory$(sku).pipe(whenTruthy()),
              ]).pipe(
                tap(([product, inventory]) => {
                  // add slide to the hidden list if product is not available
                  if (!inventory?.inStock || product.failed) {
                    this.state.set('hiddenSlides', () =>
                      [...this.state.get('hiddenSlides'), index].filter((v, i, a) => a.indexOf(v) === i)
                    );
                  }
                }),
                filter(([product, inventory]) => inventory?.inStock && !product.failed),
                map(([product, _]) => product.sku)
              )
            );
          } else {
            return products.map(sku => of(sku));
          }
        })
      ),
      this.state.select('hiddenSlides'),
    ]).pipe(map(([products, hiddenSlides]) => products.filter((_, index) => !hiddenSlides.includes(index))));

    this.state.connect('products$', filteredProducts$);
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }
}
