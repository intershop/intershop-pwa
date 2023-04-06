import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import SwiperCore, { Navigation } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

SwiperCore.use([Navigation]);

/**
 * The Product Images Component
 *
 * Displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * If zoom images are available and the user clicks on the image a zoom images dialog opens up.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images></ish-product-images>
 */
@Component({
  selector: 'ish-product-images',
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImagesComponent implements OnInit {
  @ViewChild('carousel') carousel: SwiperComponent;
  @ViewChild('zoomDialog') zoomDialog: ModalDialogComponent<unknown>;

  product$: Observable<ProductView>;
  zoomImageIds$: Observable<string[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.zoomImageIds$ = this.getImageViewIDs$('ZOOM').pipe(shareReplay(1));
  }

  getImageViewIDs$(imageType: string): Observable<string[]> {
    return this.product$.pipe(
      map(p => ProductHelper.getImageViewIDs(p, imageType)),
      map(ids => (ids?.length ? ids : imageType === 'ZOOM' ? undefined : ['default']))
    );
  }

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   *
   * @param slideIndex The slide index to set the active slide
   */
  setActiveSlide(slideIndex: number) {
    this.carousel?.swiperRef?.slideTo(slideIndex);
  }

  /**
   * Check if the given slide index equals the active slide
   *
   * @param slideIndex The slide index to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.carousel?.swiperRef?.activeIndex === slideIndex;
  }

  getZoomImageAnchorId(i: number) {
    return `zoom-image-${i}`;
  }

  openZoomModal(i: number) {
    if (this.zoomDialog) {
      this.zoomDialog.show();
      this.zoomDialog.scrollToAnchor(this.getZoomImageAnchorId(i));
    }
    return false;
  }
}
