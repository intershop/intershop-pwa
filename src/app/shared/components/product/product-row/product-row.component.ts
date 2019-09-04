import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductRowComponentConfiguration {
  allowZeroQuantity: boolean;
  quantityLabel: string;
  readOnly(p: Product): boolean;
  displayName(p: Product): boolean;
  displayDescription(p: Product): boolean;
  displaySKU(p: Product): boolean;
  displayInventory(p: Product): boolean;
  displayPrice(p: Product): boolean;
  displayPromotions(p: Product): boolean;
  displayQuantity(p: Product): boolean;
  displayVariations(p: Product): boolean;
  displayShipment(p: Product): boolean;
  displayAddToBasket(p: Product): boolean;
  displayAddToCompare(p: Product): boolean;
  displayAddToQuote(p: Product): boolean;
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
  @Input() category?: Category;
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

  is(property: keyof ProductRowComponentConfiguration): boolean {
    // tslint:disable-next-line:no-any
    return this.configuration[property] && (this.configuration[property] as any)(this.product);
  }
}
