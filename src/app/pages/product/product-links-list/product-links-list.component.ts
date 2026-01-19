import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';

/**
 * The Product Link List Component
 *
 * Displays the products which are assigned to a specific type as an list.
 * It uses the {@link ProductItemComponent} for the rendering of products.
 *
 * @example
 * <ish-product-links-list [links]="links.upselling" [productLinkTitle]="'product.product_links.upselling.title' | translate"></ish-product-links-list>
 */
@Component({
  selector: 'ish-product-links-list',
  templateUrl: './product-links-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLinksListComponent implements OnChanges {
  /**
   * list of product SKUs which are assigned to the specific product link type
   */
  @Input({ required: true }) links: ProductLinks;
  /**
   * title that should displayed for the specific product link type
   */
  @Input({ required: true }) productLinkTitle: string;
  /**
   * display only available products if set to 'true'
   */
  @Input() displayOnlyAvailableProducts = false;

  productSKUs$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    this.productSKUs$ = this.displayOnlyAvailableProducts
      ? combineLatest(
          this.links.products.map(sku =>
            combineLatest([
              // make sure to load product and inventory data
              this.shoppingFacade.product$(sku, ProductCompletenessLevel.List),
              this.shoppingFacade.productInventory$(sku),
            ]).pipe(map(([_, inventory]) => ({ sku, available: inventory?.inStock ?? false })))
          )
        ).pipe(map(results => results.filter(r => r.available).map(r => r.sku)))
      : of(this.links.products);
  }
}
