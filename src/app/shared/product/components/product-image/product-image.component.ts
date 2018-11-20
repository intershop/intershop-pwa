import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';

import { Image } from 'ish-core/models/image/image.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { ICM_BASE_URL } from 'ish-core/services/state-transfer/factories';

@Component({
  selector: 'ish-product-image',
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnChanges {
  @Input()
  product: Product;
  @Input()
  imageType: string;
  @Input()
  imageView?: string;
  @Input()
  class?: string;
  @Input()
  altText?: string;

  productImage: Image;

  constructor(@Inject(ICM_BASE_URL) public icmBaseURL) {}

  ngOnChanges() {
    this.productImage = this.imageView
      ? ProductHelper.getImageByImageTypeAndImageView(this.product, this.imageType, this.imageView)
      : ProductHelper.getPrimaryImage(this.product, this.imageType);
  }
}
