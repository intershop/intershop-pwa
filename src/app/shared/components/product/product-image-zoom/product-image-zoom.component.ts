import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Image } from 'ish-core/models/image/image.model';

/**
 * The Product Image Component renders the product image with the library ngx-image-zoom
 * for the given imageType and imageView or the according defaults.
 *
 * @example
 * <ish-product-image-zoom
 *   [ngClass]="{ 'product-image-zoom': zoomImageIds$ | async }"
 *   [imageView]="imageView"
 * ></ish-product-image-zoom>
 */
@Component({
  selector: 'ish-product-image-zoom',
  templateUrl: './product-image-zoom.component.html',
  styleUrls: ['./product-image-zoom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageZoomComponent implements OnInit {
  /**
   * If true, a product link is generated around the component or the given link target is taken
   */
  @Input() link = false;
  @Input() linkTarget: string;

  @Input() queryParamsHandling: QueryParamsHandling = '';
  /**
   * The image view, e.g. 'front', 'back'.
   */
  @Input() imageView: string;
  /**
   * A custom alt text for the img tag.
   */
  @Input() altText: string;

  productURL$: Observable<string>;
  productImage$: Observable<[Image, Image, string]>;

  computedQueryParamsHandling: QueryParamsHandling;

  constructor(
    private translateService: TranslateService,
    private context: ProductContextFacade,
    @Optional() @Inject('PRODUCT_QUERY_PARAMS_HANDLING') private queryParamsHandlingInjector: QueryParamsHandling
  ) {}

  ngOnInit() {
    this.productURL$ = this.context.select('productURL');

    this.productImage$ = combineLatest([
      this.context.getProductImage$('L', this.imageView),
      this.context.getProductImage$('ZOOM', this.imageView),
      combineLatest([
        this.context.select('product').pipe(map(product => product?.name || product?.sku || '')),
        this.translateService.get('product.image.text.alttext'),
      ]).pipe(map(parts => parts.filter(x => !!x).join(' '))),
    ]);

    this.computedQueryParamsHandling = this.queryParamsHandlingInjector ?? this.queryParamsHandling;
  }
}
