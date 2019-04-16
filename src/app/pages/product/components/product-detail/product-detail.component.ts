import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() currentUrl: string;
  @Input() variationOptions: VariationOptionGroup[];
  @Output() productToBasket = new EventEmitter<{ sku: string; quantity: number }>();
  @Output() productToCompare = new EventEmitter<string>();
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  productDetailForm: FormGroup;
  readonly quantityControlName = 'quantity';

  isVariationProduct = ProductHelper.isVariationProduct;
  isMasterProduct = ProductHelper.isMasterProduct;

  ngOnInit() {
    this.productDetailForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.product.minOrderQuantity),
    });
  }

  addToBasket() {
    this.productToBasket.emit({
      sku: this.product.sku,
      quantity: this.productDetailForm.get(this.quantityControlName).value,
    });
  }

  addToCompare() {
    this.productToCompare.emit(this.product.sku);
  }

  get quantity(): number {
    return this.productDetailForm.get(this.quantityControlName).value;
  }

  variationSelected(selection: VariationSelection) {
    this.selectVariation.emit(selection);
  }
}
