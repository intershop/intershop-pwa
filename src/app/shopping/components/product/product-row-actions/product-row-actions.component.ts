import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ish-product-row-actions',
  templateUrl: './product-row-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductRowActionsComponent {

  @Output() productToCart = new EventEmitter<any>();

  addToCart() {
    this.productToCart.emit();
  }

}
