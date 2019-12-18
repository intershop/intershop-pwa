import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Image } from 'ish-core/models/image/image.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Image Component renders the product image
 * for the given imageType and imageView or the according defaults.
 *
 * @example
 * <ish-product-image [product]="product" imageType="M"></ish-product-image>
 */
@Component({
  selector: 'ish-product-image',
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnChanges {
  /**
   * The product with the image information.
   */
  @Input() product: Product;
  /**
   * The image type (size), i.e. 'S' for the small image.
   */
  @Input() imageType: string;
  /**
   * The image view, e.g. 'front', 'back'.
   */
  @Input() imageView?: string;
  /**
   * The additional CSS classes for the img tag.
   */
  @Input() class?: string;
  /**
   * A custom alt text for the img tag.
   */
  @Input() altText?: string;

  productImage: Image;

  // defered loading flag
  showImage = false;

  constructor(private translateService: TranslateService) {}

  ngOnChanges() {
    this.productImage = this.imageView
      ? ProductHelper.getImageByImageTypeAndImageView(this.product, this.imageType, this.imageView)
      : ProductHelper.getPrimaryImage(this.product, this.imageType);
  }

  /**
   * Gets the image source URL from the effectiveUrl of the product image.
   * @returns defined effectiveUrl or empty string.
   */
  imageSourceUrl(): string {
    return this.productImage && this.productImage.effectiveUrl && this.productImage.effectiveUrl.length > 0
      ? `${this.productImage.effectiveUrl}`
      : '/assets/img/not_available.png';
  }

  /**
   * Builds the alternative text from a product image.
   * @returns Property altText or a string composed of
   * (a) product name OR product SKU and
   * (b) an additional defined alt text
   * (c) image view and image type if image view is given
   */
  getImgAltText(): string {
    return this.altText ? this.altText : `${this.buildProductNameOrProductSku()} ${this.buildAdditionalAltText()}`;
  }

  private buildProductNameOrProductSku(): string {
    return this.product ? (this.product.name ? this.product.name : this.product.sku) : '';
  }

  private buildAdditionalAltText(): string {
    return `${this.translateService.instant('product.image.text.alttext')}${this.buildAltTextForGivenImageView()}`;
  }

  private buildAltTextForGivenImageView(): string {
    return this.imageView ? ` ${this.imageView} ${this.imageType}` : '';
  }
}
