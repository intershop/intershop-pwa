import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.model';

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
  @ViewChild('carousel') carousel: NgbCarousel;

  activeSlide = '0';

  constructor(private context: ProductContextFacade) {}

  getImageViewIDsExcludePrimary$(imageType: string) {
    return this.context.select('product').pipe(map(p => ProductHelper.getImageViewIDsExcludePrimary(p, imageType)));
  }

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   * @param slideIndex The slide index to set the active slide
   */
  setActiveSlide(slideIndex: number | string) {
    this.activeSlide = slideIndex?.toString();

    this.carousel.select(this.activeSlide);
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
