import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductLinks } from 'ish-core/models/product-links/product-links.model';

/**
 * The Product Link List Component
 *
 * Displays the products which are assigned to a specific type as an list.
 * It uses the {@link ProductItemContainerComponent} for the rendering of products.
 *
 * @example
 * <ish-product-links-list [links]="links.upselling" [productLinkTitle]="'product.product_links.upselling.title' | translate"></ish-product-links-list>
 */
@Component({
  selector: 'ish-product-links-list',
  templateUrl: './product-links-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLinksListComponent {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() links: ProductLinks;
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;
}
