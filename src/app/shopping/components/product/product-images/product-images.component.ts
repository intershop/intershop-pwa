import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductImagesComponent {

  @Input() product: Product;

  activeSlide = 0;

  setActiveSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
  }

  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }

}
