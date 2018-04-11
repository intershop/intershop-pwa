import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-add-to-cart',
  templateUrl: './product-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToCartComponent implements OnChanges {
  @Input() product: Product;
  @Input() disabled = false;
  @Input() displayType?: string;
  @Input() class?: string;
  @Output() productToCart = new EventEmitter<void>();

  isDisplayTypeGlyphicon = false;

  ngOnChanges() {
    this.isDisplayTypeGlyphicon = this.displayType === 'glyphicon';
  }

  addToCart() {
    this.productToCart.emit();
  }
}
