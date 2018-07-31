import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent {
  @Input()
  product: Product;
  @Input()
  category?: Category;
  @Output()
  productToBasket = new EventEmitter<void>();
  @Output()
  productToQuote = new EventEmitter<void>();

  generateProductRoute = ProductHelper.generateProductRoute;

  addToBasket() {
    this.productToBasket.emit();
  }

  addToQuote() {
    this.productToQuote.emit();
  }
}
