import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute } from '../../../../models/attribute/attribute.model';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCompareListComponent {

  @Input() compareProducts: Product[] = [];
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Output() productToCart = new EventEmitter<{ sku: string, quantity: number }>();
  @Output() removeProductCompare = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  currentPage = 1;

  generateProductRoute = ProductHelper.generateProductRoute;
  getAttributeByAttributeName = ProductHelper.getAttributeByAttributeName;

  onPageChanged(currentPage: number) {
    this.currentPage = currentPage;
    this.pageChanged.emit(currentPage);
  }

  /**
   * Return Common attributes between products compare
   * @param product
   * @returns
   */
  getCommonAttribute(product: Product): Attribute[] {
    const commonAttributes: Attribute[] = [];
    this.getCommonAttributeNames().forEach(item => {
      commonAttributes.push(product.attributes.find(x => x.name === item));
    });
    return commonAttributes;
  }

  /**
   * return specific attributes between products compare
   * @param currentProduct
   * @returns
   */
  getProductWithSpecificAttribute(currentProduct: Product): Product {
    const product: Product = { ...currentProduct };
    product.attributes = currentProduct.attributes.filter(attribute => !this.getCommonAttributeNames().has(attribute.name));
    return product;
  }

  /**
   * return common attributes name list between products compare
   * @returns
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
   * Remove the product with the given SKU from the compare list.
   * @param sku The SKU of the product to remove
   */
  removeFromCompare(sku: string) {
    this.removeProductCompare.emit(sku);
  }

  /**
   * Add product with the given quantity to the cart.
   * @param sku The SKU of the product to add
   * @param quantity The quantity to be added
   */
  addToCart(sku: string, quantity: number) {
    this.productToCart.emit({ sku: sku, quantity: quantity });
  }

}
