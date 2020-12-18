import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Images Component
 *
 * Displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images [product]="product"></ish-product-images>
 */
@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImagesComponent {
  /**
   * The product for which the images should be displayed
   */
  @Input() product: Product;

  activeSlide = '0';

  getImageViewIDsExcludePrimary = ProductHelper.getImageViewIDsExcludePrimary;

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   * @param slideIndex The slide index to set the active slide
   */
  setActiveSlide(slideIndex: number | string) {
    this.activeSlide = slideIndex?.toString();
  }

  /**
   * Check if the given slide index equals the active slide
   * @param slideIndex The slide index to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex?.toString();
  }
}
