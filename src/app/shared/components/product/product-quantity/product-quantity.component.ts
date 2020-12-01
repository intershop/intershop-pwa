import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { range } from 'lodash-es';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

function generateSelectOptionsForRange(min: number, max: number): SelectOption[] {
  return range(min, max)
    .map(num => num.toString())
    .map(num => ({ label: num, value: num }));
}

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit, OnChanges {
  @Input() readOnly = false;
  @Input() allowZeroQuantity = false;
  @Input() quantityLabel = 'product.quantity.label';
  @Input() product: Product;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() type: 'input' | 'select' | 'counter' = 'input';
  @Input() class?: string;

  quantityOptions: SelectOption[];

  ngOnInit() {
    this.parentForm.get(this.controlName).setValidators(this.getValidations());
  }

  get quantity() {
    return this.parentForm.get(this.controlName) && this.parentForm.get(this.controlName).value;
  }

  get labelClass() {
    return this.quantityLabel.trim() === '' ? 'col-0' : 'label-quantity col-6';
  }

  get inputClass() {
    return this.quantityLabel.trim() === ''
      ? 'col-12' + (this.class ? this.class : '')
      : 'col-6' + (this.class ? this.class : '');
  }

  getValidations(): ValidatorFn {
    if (this.type === 'input') {
      return Validators.compose([
        Validators.required,
        Validators.min(this.allowZeroQuantity ? 0 : this.product.minOrderQuantity),
        Validators.max(this.product.maxOrderQuantity),
        SpecialValidators.integer,
      ]);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.type === 'select') {
      this.createSelectOptions(change.product);
    }
  }

  private createSelectOptions(change: SimpleChange) {
    if (change && change.currentValue) {
      this.quantityOptions = generateSelectOptionsForRange(
        this.product.minOrderQuantity,
        this.product.maxOrderQuantity
      );
    }
  }
}
