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
import { SelectOption } from '../../../../shared/forms/components/select/select.component';
import { SpecialValidators } from '../../../../shared/forms/validators/special-validators';

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
  @Input() product: Product;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() type?: 'select' | 'input';
  @Input() class?: string;

  quantityOptions: SelectOption[];

  ngOnInit() {
    this.parentForm.get(this.controlName).setValidators(this.getValidations());
  }

  getValidations(): ValidatorFn {
    if (this.type !== 'select') {
      return Validators.compose([
        Validators.required,
        Validators.min(this.product.minOrderQuantity),
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
