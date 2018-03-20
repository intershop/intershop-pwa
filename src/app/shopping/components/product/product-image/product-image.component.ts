import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Image } from '../../../../models/image/image.model';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-image',
  templateUrl: './product-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnInit {

  @Input() product: Product;
  @Input() imageType: string;
  @Input() imageView?: string;
  @Input() class?: string;
  @Input() altText?: string;

  productImage: Image;

  constructor(
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) { }

  ngOnInit() {
    this.productImage = this.imageView
      ? ProductHelper.getImageByImageTypeAndImageView(this.product, this.imageType, this.imageView)
      : ProductHelper.getPrimaryImage(this.product, this.imageType);
  }

}
