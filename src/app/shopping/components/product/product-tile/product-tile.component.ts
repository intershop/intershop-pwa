import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductTileComponent {

  @Input() product: Product;
  @Input() category?: Category;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<any>();
  @Output() productToCart = new EventEmitter<any>();

  generateProductRoute = ProductHelper.generateProductRoute;

  toggleCompare() {
    this.compareToggle.emit();
  }

  addToCart() {
    this.productToCart.emit();
  }

}
