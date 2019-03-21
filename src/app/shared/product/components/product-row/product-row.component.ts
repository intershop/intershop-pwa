import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Category } from 'ish-core/models/category/category.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent implements OnInit {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() variationOptions: VariationOptionGroup[];
  @Input() category?: Category;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<number>();
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  productItemForm: FormGroup;
  readonly quantityControlName = 'quantity';

  ngOnInit() {
    this.productItemForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.product.minOrderQuantity),
    });
  }

  addToBasket() {
    this.productToBasket.emit(this.productItemForm.get(this.quantityControlName).value);
  }

  toggleCompare() {
    this.compareToggle.emit();
  }

  variationSelected(selection: VariationSelection) {
    if (ProductHelper.isVariationProduct(this.product)) {
      this.selectVariation.emit(selection);
    }
  }
}
