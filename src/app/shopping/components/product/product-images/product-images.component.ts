import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductImagesComponent {

  @Input() product: Product;

  /**
   * defines a method to be called in the template
   */
  getImageViewIDsExcludePrimary = ProductHelper.getImageViewIDsExcludePrimary;

  /**
   * local variable for index of active image in the thumbnail slide
   */
  activeSlide = 0;

  setActiveSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
  }

  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }

}
