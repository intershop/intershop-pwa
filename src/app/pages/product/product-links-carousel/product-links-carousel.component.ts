import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, combineLatest, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import SwiperCore, { Navigation, Pagination, SwiperOptions } from 'swiper';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { mapToProperty } from 'ish-core/utils/operators';

SwiperCore.use([Navigation, Pagination]);

/**
 * The Product Link Carousel Component
 *
 * Displays the products which are assigned to a specific product link type as an carousel.
 * It uses the {@link ProductItemComponent} for the rendering of products.
 *
 * @example
 * <ish-product-links-carousel [links]="links.crossselling" [productLinkTitle]="'product.product_links.crossselling.title' | translate"></ish-product-links-carousel>
 */
@Component({
  selector: 'ish-product-links-carousel',
  templateUrl: './product-links-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ProductLinksCarouselComponent {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() set links(links: ProductLinks) {
    this.state.set('products', () => links.products);
  }
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;
  /**
   * display only available products if set to 'true'
   */
  @Input() set displayOnlyAvailableProducts(value: boolean) {
    this.state.set('displayOnlyAvailableProducts', () => value);
  }

  productSKUs$ = this.state.select('products$');

  /**
   * track already fetched SKUs
   */
  private fetchedSKUs = new Set<Observable<string>>();

  /**
   * configuration of swiper carousel
   * https://swiperjs.com/swiper-api
   */
  swiperConfig: SwiperOptions;

  constructor(
    @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: number,
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

    this.swiperConfig = {
      watchSlidesProgress: true,
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

    const filteredProducts$ = combineLatest([
      combineLatest([this.state.select('products'), this.state.select('displayOnlyAvailableProducts')]).pipe(
        map(([products, displayOnlyAvailableProducts]) => {
          // prepare lazy observables for all products
          if (displayOnlyAvailableProducts) {
            return products.map((sku, index) =>
              this.shoppingFacade.product$(sku, ProductCompletenessLevel.List).pipe(
                tap(product => {
                  // add slide to the hidden list if product is not available
                  if (!product.available || product.failed) {
                    this.state.set('hiddenSlides', () =>
                      [...this.state.get('hiddenSlides'), index].filter((v, i, a) => a.indexOf(v) === i)
                    );
                  }
                }),
                filter(product => product.available && !product.failed),
                mapToProperty('sku')
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

  lazyFetch(fetch: boolean, sku$: Observable<string>): Observable<string> {
    if (fetch) {
      this.fetchedSKUs.add(sku$);
    }
    if (this.fetchedSKUs.has(sku$)) {
      return sku$;
    }
    return EMPTY;
  }
}
