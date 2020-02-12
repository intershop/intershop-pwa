import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductRowComponentConfiguration {
  readOnly: boolean;
  allowZeroQuantity: boolean;
  quantityLabel: string;
  displayName: boolean;
  displayDescription: boolean;
  displaySKU: boolean;
  displayInventory: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayQuantity: boolean;
  displayVariations: boolean;
  displayShipment: boolean;
  displayAddToBasket: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
}

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent implements OnInit, OnDestroy {
  @Input() configuration: Partial<ProductRowComponentConfiguration> = {};
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() quantity: number;
  @Output() quantityChange = new EventEmitter<number>();
  @Input() variationOptions: VariationOptionGroup[];
  @Input() category?: CategoryView;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<number>();
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  isMasterProduct = ProductHelper.isMasterProduct;

  productItemForm: FormGroup;
  readonly quantityControlName = 'quantity';

  private destroy$ = new Subject();

  ngOnInit() {
    this.productItemForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.quantity || this.product.minOrderQuantity),
    });
    this.productItemForm
      .get(this.quantityControlName)
      .valueChanges.pipe(
        map(val => +val),
        takeUntil(this.destroy$)
      )
      .subscribe(this.quantityChange);
  }

  ngOnDestroy() {
    this.destroy$.next();
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
