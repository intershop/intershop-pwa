import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-tile-actions',
  templateUrl: './product-tile-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTileActionsComponent {

  @Input() isInCompareList: boolean;
  @Input() product: Product;
  @Output() compareToggle = new EventEmitter<any>();
  @Output() productToCart = new EventEmitter<any>();

  toggleCompare() {
    this.compareToggle.emit();
  }

  addToCart() {
    this.productToCart.emit();
  }
}
