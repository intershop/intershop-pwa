import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product/product.model';
import { Attribute } from '../../../models/attribute/attribute.model';

@Component({
  selector: 'ish-product-attributes',
  templateUrl: './product-attributes.component.html',
})
export class ProductAttributesComponent implements OnInit {

  @Input() product: Product;
  @Input() attributeseperator: string = ',&nbsp';
  constructor() { }

  isObject(attribute: any) {
    let test = this.product;
    return attribute.value && typeof attribute.value === 'object' && attribute.value.constructor === Object;
  }
  ngOnInit() {
  }

}
