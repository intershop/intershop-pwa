import { Component, Inject, Input, OnInit } from '@angular/core';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Image } from '../../../../models/image/image.model';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-image',
  templateUrl: './product-image.component.html'
})
export class ProductImageComponent implements OnInit {

  @Input() product: Product;
  @Input() imageType: string;
  @Input() imageView?: string;
  @Input() class?: string;
  @Input() altText?: string;
  productImage: Image;

  /**
   * Constructor
   * @param  {} @Inject(ICM_BASE_URL
   * @param  {} publicicmBaseURL
   */
  constructor( @Inject(ICM_BASE_URL) public icmBaseURL) {

  }

  /**
   * Component event ngOninit
   */
  ngOnInit() {
    this.productImage = this.imageView ? this.product.getImageByImageTypeAndImageView(this.imageType, this.imageView)
      : this.product.getPrimaryImage(this.imageType);
  }

}
