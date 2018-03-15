import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-actions',
  templateUrl: './product-row-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRowActionsComponent {

  @Input() product: Product;
  @Output() productToCart = new EventEmitter<any>();

  addToCart() {
    this.productToCart.emit();
  }

}
