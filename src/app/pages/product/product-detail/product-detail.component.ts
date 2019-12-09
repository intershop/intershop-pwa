import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() quantity: number;
  @Input() price: ProductPrices;
  @Input() currentUrl: string;
  @Input() variationOptions: VariationOptionGroup[];
  @Output() productToBasket = new EventEmitter<{ sku: string; quantity: number }>();
  @Output() productToCompare = new EventEmitter<string>();
  @Output() selectVariation = new EventEmitter<VariationSelection>();
  @Output() quantityChange = new EventEmitter<number>();

  productDetailForm: FormGroup;
  readonly quantityControlName = 'quantity';

  showAddToCart = ProductHelper.showAddToCart;
  isVariationProduct = ProductHelper.isVariationProduct;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;

  private destroy$ = new Subject();

  ngOnInit() {
    this.productDetailForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.quantity || this.product.minOrderQuantity),
    });
    this.productDetailForm
      .get(this.quantityControlName)
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.quantityChange);
  }

  ngOnDestroy() {
    this.destroy$.next();
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

  variationSelected(selection: VariationSelection) {
    this.selectVariation.emit(selection);
  }
}
