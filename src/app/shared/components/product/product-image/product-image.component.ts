import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Image } from 'ish-core/models/image/image.model';

/**
 * The Product Image Component renders the product image
 * for the given imageType and imageView or the according defaults.
 *
 * @example
 * <ish-product-image imageType="M" [link]="true"></ish-product-image>
 */
@Component({
  selector: 'ish-product-image',
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnInit {
  /**
   * If true, a product link is generated around the component
   */
  @Input() link = false;
  @Input() queryParamsHandling: QueryParamsHandling = 'merge';
  /**
   * The image type (size), i.e. 'S' for the small image.
   */
  @Input() imageType: string;
  /**
   * The image view, e.g. 'front', 'back'.
   */
  @Input() imageView?: string;
  /**
   * A custom alt text for the img tag.
   */
  @Input() altText?: string;

  productURL$: Observable<string>;
  productImage$: Observable<Image>;
  defaultAltText$: Observable<string>;

  /**
   * deferred loading flag
   */
  showImage$ = new ReplaySubject(1);

  constructor(private translateService: TranslateService, private context: ProductContextFacade) {}

  ngOnInit() {
    this.productURL$ = this.context.select('productURL');
    this.productImage$ = combineLatest([
      this.context.getProductImage$(this.imageType, this.imageView),
      this.showImage$,
    ]).pipe(map(([i]) => i));
    this.defaultAltText$ = this.context
      .select('product')
      .pipe(map(product => [product?.name || product?.sku || '', this.buildAdditionalAltText()].join(' ')));
  }

  private buildAdditionalAltText(): string {
    return `${this.translateService.instant('product.image.text.alttext')}${this.buildAltTextForGivenImageView()}`;
  }

  private buildAltTextForGivenImageView(): string {
    return this.imageView ? ` ${this.imageView} ${this.imageType}` : '';
  }
}
