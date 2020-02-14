import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Compare List Component
 *
 * Displays a table of products to be compared with paging handled by the {@link ProductComparePagingComponent}.
 *
 * @example
 * <ish-product-compare-list
 *               [compareProducts]="compareProducts"
 *               (productToBasket)="addToBasket($event)"
 *               (removeProductCompare)="removeFromCompare($event)"
 * ></ish-product-compare-list>
 */
@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareListComponent implements OnChanges {
  /**
   * The list of products to compare
   */
  @Input() compareProducts: ProductView[] = [];

  /**
   * The maximum number of products to be compared on one page
   */
  @Input() itemsPerPage = 3;

  /**
   * Trigger an add product to basket event
   */
  @Output() productToBasket = new EventEmitter<{ sku: string; quantity: number }>();

  /**
   * Trigger a remove product from compare event
   */
  @Output() removeProductCompare = new EventEmitter<string>();

  commonAttributeNames: string[];
  visibleProducts: ProductView[] = [];
  currentPage = 1;

  getAttributeByAttributeName = AttributeHelper.getAttributeByAttributeName;

  getProductWithoutCommonAttributes = ProductHelper.getProductWithoutCommonAttributes;

  ngOnChanges() {
    this.commonAttributeNames = ProductHelper.getCommonAttributeNames(this.compareProducts);
    // decrease the current page value if the current page would be empty because of removing a product from compare
    if ((this.currentPage - 1) * this.itemsPerPage >= this.compareProducts.length) {
      this.currentPage = this.currentPage - 1;
    }
    this.setVisibleProducts();
  }

  /**
   * Changes the current page and sets the according compare products to be visible.
   * @param pageNumber The page number to set the current page to
   */
  changeCurrentPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.setVisibleProducts();
  }

  /**
   * Sets the visible products of the compare products based on the items per page and the current page.
   */
  setVisibleProducts() {
    this.visibleProducts = this.compareProducts.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  /**
   * Remove the product with the given SKU from the compare list.
   * @param sku The SKU of the product to remove
   */
  removeFromCompare(sku: string) {
    this.removeProductCompare.emit(sku);
  }

  /**
   * Add product with the given quantity to the basket.
   * @param sku       The SKU of the product to add
   * @param quantity  The quantity to be added
   */
  addToBasket(sku: string, quantity: number) {
    this.productToBasket.emit({ sku, quantity });
  }
}
