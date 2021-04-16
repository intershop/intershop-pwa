import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Navigation } from 'swiper/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

SwiperCore.use([Navigation]);

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
export class ProductImagesComponent implements OnInit {
  @ViewChild('carousel') carousel: SwiperComponent;

  activeSlide = 0;

  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  getImageViewIDs$(imageType: string): Observable<string[]> {
    return this.product$.pipe(
      map(p => ProductHelper.getImageViewIDs(p, imageType)),
      map(ids => (ids?.length ? ids : ['default']))
    );
  }

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   * @param slideIndex The slide index to set the active slide
   */
  setActiveSlide(slideIndex: number) {
    this.carousel.setIndex(slideIndex);
  }

  /**
   * Check if the given slide index equals the active slide
   * @param slideIndex The slide index to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }
}
