import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { ProductLinks } from 'ish-core/models/product-links/product-links.model';

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
   * configuration for swiper carousel
   */
  @Input() swiperConfig: SwiperConfigInterface;
}
