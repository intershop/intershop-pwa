import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-add-to-cart',
  templateUrl: './product-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAddToCartComponent implements OnChanges {
  @Input() product: Product;
  @Input() quantity: number;
  @Input() displayType?: string;
  @Input() class?: string;
  isDisplayTypeGlyphicon: boolean;

  addToCart() {
    console.log('sku:' + this.product.sku + ' Quantity:' + this.quantity);
  }

  ngOnChanges(): void {
    this.isDisplayTypeGlyphicon = this.displayType === 'glyphicon';
  }
}
