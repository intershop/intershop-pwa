import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, map, shareReplay, tap } from 'rxjs/operators';
import Swiper from 'swiper';
import { A11y, Navigation } from 'swiper/modules';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductImageComponent as ProductImageComponent_1 } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';

/**
 * The Product Images Component
 *
 * Displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * If zoom images are available and the user clicks on the image a zoom images dialog opens up.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images />
 */
@Component({
  selector: 'ish-product-images',
  imports: [AsyncPipe, ModalDialogComponent, NgClass, ProductImageComponent_1, ProductLabelComponent],
  standalone: true,
  templateUrl: './product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
})
export class ProductImagesComponent implements OnInit, OnDestroy {
  private swiper: Swiper;

  @ViewChild('swiper') set swiperRef(ref: ElementRef) {
    if (ref && !this.swiper && !SSR) {
      const swiperEl = ref.nativeElement;
      this.swiper = new Swiper(swiperEl, {
        modules: [A11y, Navigation],
        navigation: {
          nextEl: swiperEl.querySelector('.swiper-button-next'),
          prevEl: swiperEl.querySelector('.swiper-button-prev'),
        },
        on: {
          slideChange: () => this.cdRef.markForCheck(),
        },
      });
    }
  }

  @ViewChild('zoomDialog') zoomDialog: ModalDialogComponent<unknown>;

  product$: Observable<ProductView>;
  zoomImageIds$: Observable<string[]>;

  constructor(
    private context: ProductContextFacade,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product').pipe(
      whenTruthy(),
      distinctUntilKeyChanged('sku'),
      tap(() => {
        if (this.swiper?.activeIndex) {
          this.setActiveSlide(0);
        }
      }),
      shareReplay(1)
    );
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
    this.swiper?.slideTo(slideIndex);
  }

  /**
   * Check if the given slide index equals the active slide
   *
   * @param slideIndex The slide index to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return (this.swiper?.activeIndex ?? 0) === slideIndex;
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

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }
}
