import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { range } from 'lodash-es';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from '../../../../shared/forms/components/select/select.component';
import { SpecialValidators } from '../../../../shared/forms/validators/special-validators';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit, OnChanges {
  @Input()
  product: Product;
  @Input()
  parentForm: FormGroup;
  @Input()
  controlName: string;
  @Input()
  type?: string;
  @Input()
  class?: string;

  readonly selectType = 'select';

  quantityOptions: SelectOption[];

  ngOnInit() {
    this.parentForm.get(this.controlName).setValidators(this.getValidations());
  }

  getValidations(): ValidatorFn {
    if (this.type !== this.selectType) {
      return Validators.compose([
        Validators.required,
        Validators.min(this.product.minOrderQuantity),
        Validators.max(this.product.maxOrderQuantity),
        SpecialValidators.integer,
      ]);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.product && change.product.currentValue) {
      this.quantityOptions = range(this.product.minOrderQuantity, this.product.maxOrderQuantity)
        .map(num => num.toString())
        .map(num => ({ label: num, value: num }));
    }
  }
}
