import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToBasketComponent implements OnChanges {
  @Input() product: Product;
  @Input() disabled = false;
  @Input() displayType?: string;
  @Input() class?: string;
  @Output() productToBasket = new EventEmitter<void>();

  isDisplayTypeGlyphicon = false;

  ngOnChanges() {
    this.isDisplayTypeGlyphicon = this.displayType === 'glyphicon';
  }

  addToBasket() {
    this.productToBasket.emit();
  }
}
