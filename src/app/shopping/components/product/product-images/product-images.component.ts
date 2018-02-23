import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product, ProductHelper } from '../../../../models/product/product.model';

/**
 * the product images component
 *
 * displays a list of thumbnails for all images of the product and includes the {@link ProductImageComponent}
 *
 * @example
 * <ish-product-images [product]="product"></ish-product-images>
 */
@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductImagesComponent {

  /**
   * product for which the images should be displayed
   */
  @Input() product: Product;

  /**
   * defines a method to be called in the template
   */
  getImageViewIDsExcludePrimary = ProductHelper.getImageViewIDsExcludePrimary;

  /**
   * local variable for index of active image in the thumbnail slide
   */
  activeSlide = 0;

  /**
   * set the index of active image in the thumbnail slide
   */
  setActiveSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
  }

  /**
   * get the index of active image in the thumbnail slide
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }

}
