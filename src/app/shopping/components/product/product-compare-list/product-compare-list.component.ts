import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCompareListComponent implements OnChanges {

  @Input() compareProducts: Product[] = [];
  @Input() totalItems: number;
  @Input() itemsPerPage = 3;
  @Output() productToCart = new EventEmitter<{ sku: string, quantity: number }>();
  @Output() removeProductCompare = new EventEmitter<string>();

  commonAttributeNames: Set<string>;
  visibleProducts: Product[] = [];
  currentPage = 1;

  generateProductRoute = ProductHelper.generateProductRoute;
  getAttributeByAttributeName = ProductHelper.getAttributeByAttributeName;

  ngOnChanges() {
    this.commonAttributeNames = this.getCommonAttributeNames();
    // decrease the current page value if the current page would be empty because of removing a product from compare
    if (!((this.currentPage - 1) * this.itemsPerPage < this.totalItems)) {
      this.currentPage = this.currentPage - 1;
    }
    this.setVisibleProducts();
  }

  /**
   * Changes the current page number and sets the appropriate compare products to be visible.
   * @param currentPage The current page number to be set
   */
  onPageChanged(currentPage: number) {
    this.currentPage = currentPage;
    this.setVisibleProducts();
  }

  /**
   * Sets the visible products of the compare products based on the items per page and the current page.
   */
  setVisibleProducts() {
    this.visibleProducts = this.compareProducts.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  /**
   * Determines the set of common attribute names for the compare products.
   * @returns A set of the common attribute names.
   */
  getCommonAttributeNames(): Set<string> {
    const result = this.compareProducts.reduce((commonAttributeNameList, current) => {
      commonAttributeNameList.push(current.attributes.map(x => x.name));
      return commonAttributeNameList;
    }, <string[][]>[]);

    return new Set(result.shift().filter(attribute => {
      return result.every(x => {
        return x.indexOf(attribute) !== -1;
      });
    }));
  }

  /**
   * Get a product with only specific attributes. All attributes that are common between the compare products are filtered out.
   * @param product The Products that should be stripped of its common attributes
   * @returns       A Product with specific attributes only compared to the common attributes.
   */
  getProductWithSpecificAttributesOnly(product: Product): Product {
    const specificAttributesProduct: Product = { ...product };
    specificAttributesProduct.attributes = product.attributes.filter(attribute => !this.commonAttributeNames.has(attribute.name));
    return specificAttributesProduct;
  }

  /**
   * Remove the product with the given SKU from the compare list.
   * @param sku The SKU of the product to remove
   */
  removeFromCompare(sku: string) {
    this.removeProductCompare.emit(sku);
  }

  /**
   * Add product with the given quantity to the cart.
   * @param sku       The SKU of the product to add
   * @param quantity  The quantity to be added
   */
  addToCart(sku: string, quantity: number) {
    this.productToCart.emit({ sku: sku, quantity: quantity });
  }

}
