import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute } from '../../../../models/attribute/attribute.model';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCompareListComponent {

  @Input() compareProducts: Product[] = [];
  @Input() totalItems: number;
  @Output() productToCart = new EventEmitter<{ sku: string, quantity: number }>();
  @Output() removeProductCompare = new EventEmitter<string>();

  /**
   * Return Common attributes between products compare
   * @param  {Product} product
   * @returns Attribute
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
   * @param  {Product} currentProduct
   * @returns Product
   */
  getProductWithSpecificAttribute(currentProduct: Product): Product {
    const product: Product = { ...currentProduct };
    product.attributes = currentProduct.attributes.filter(attribute => !this.getCommonAttributeNames().has(attribute.name));
    return product;
  }

  /**
   * return common attributes name list between products compare
   * @returns Set
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
   * return Attribute based on passing product and attribute name
   * @param  {Product} product
   * @param  {string} attributeName
   * @returns Attribute
   */
  getAttribute(product: Product, attributeName: string): Attribute {
    return product.attributes.find(attribute => attribute.name === attributeName);
  }

  /**
   * remove compare product
   * @param  {string} sku
   */
  removeCompareProduct(sku: string) {
    this.removeProductCompare.emit(sku);
  }

  /**
   * Add product to cart
   * @param  {string} sku
   */
  addToCart(sku: string, quantity: number) {
    this.productToCart.emit({ sku: sku, quantity: quantity });
  }

}
