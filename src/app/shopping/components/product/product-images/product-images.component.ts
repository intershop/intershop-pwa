import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html'
})

export class ProductImagesComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

}
