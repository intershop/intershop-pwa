import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-actions-container',
  templateUrl: './product-row-actions.container.html'
})

export class ProductRowActionsContainerComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

  addToCart() {
    console.log('[ProductRowActionsContainer] Add ' + this.product.name + ' to Cart');
  }

}
