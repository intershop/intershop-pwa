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
    console.log('setActiveSlide');
    this.activeSlide = slideIndex;
  }

  isActiveSlide(slideIndex: number): boolean {
    console.log('isActiveSlide');
    return this.activeSlide === slideIndex;
  }

}
