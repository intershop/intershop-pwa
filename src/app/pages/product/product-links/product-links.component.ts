import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinksView } from 'ish-core/models/product-links/product-links.model';

/**
 * The Product Link Container Component
 *
 * Collects all types of product links and prepares their rendering.
 * Product links can be displayed as product list (uses {@link ProductLinkListComponent}) or product carousel (uses  {@link ProductLinksCarouselComponent}).
 * For the carousel ngx-swiper-wrapper is used. Specific configuration for product link carousels have to be done here.
 *
 * @example
 * <ish-product-links-list [links]="links.upselling" [productLinkTitle]="'product.product_links.upselling.title' | translate"></ish-product-links-list>
 */
@Component({
  selector: 'ish-product-links',
  templateUrl: './product-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLinksComponent implements OnChanges {
  /**
   * sku of the product whose product links should be rendered
   */
  @Input() sku: string;

  links$: Observable<ProductLinksView>;

  /**
   * configuration of swiper carousel
   * find possible parameters here: http://idangero.us/swiper/api/#parameters
   */
  swiperConfig: SwiperConfigInterface;

  constructor(private shoppingFacade: ShoppingFacade, @Inject(LARGE_BREAKPOINT_WIDTH) largeBreakpointWidth: number) {
    this.swiperConfig = {
      breakpoints: {
        [largeBreakpointWidth]: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        clickableClass: 'swiper-pagination-clickable',
      },
      slidesPerView: 4,
      slidesPerGroup: 4,
    };
  }

  ngOnChanges() {
    if (this.sku) {
      this.links$ = this.shoppingFacade.productLinks$(this.sku);
    }
  }
}
