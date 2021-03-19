import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
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
export class ProductLinksCarouselComponent implements OnInit, OnDestroy {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() links: ProductLinks;
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;

  /**
   * configuration to filter products which are not inStock
   */
  @Input() filterInStock = false;

  productSKUs: Array<string> = [];
  private destroy$ = new Subject();
  private products: Array<ProductView> = [];
  /**
   * configuration of swiper carousel
   * find possible parameters here: http://idangero.us/swiper/api/#parameters
   */
  swiperConfig: SwiperOptions;

  constructor(
    @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: number,
    private ref: ChangeDetectorRef,
    private shoppingFacade: ShoppingFacade
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

  ngOnInit() {
    if (!this.filterInStock) {
      this.productSKUs = this.links.products;
    } else {
      this.links.products.forEach(sku =>
        this.shoppingFacade
          .product$(sku, ProductCompletenessLevel.List)
          .pipe(takeUntil(this.destroy$))
          .subscribe(p => this.collectSKUs(p))
      );
    }
  }

  collectSKUs(product: ProductView) {
    this.products.push(product);
    if (this.products.length === this.links.products.length) {
      this.productSKUs = this.products.filter(p => p.available).map(p => p.sku);
      this.ref.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
