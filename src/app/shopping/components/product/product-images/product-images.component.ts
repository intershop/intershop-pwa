import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html'
})

export class ProductImagesComponent {
  @Input() product: Product;
  activeSlide = 0;
}
