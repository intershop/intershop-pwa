import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { SelectOption } from '../../../../forms/shared/components/form-controls/select';
import { SpecialValidators } from '../../../../forms/shared/validators/special-validators';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
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

  get quantityOptions(): SelectOption[] {
    return Array.from(
      { length: this.product.maxOrderQuantity - this.product.minOrderQuantity + 1 },
      (_, index) =>
        ({
          label: (this.product.minOrderQuantity + index).toString(),
          value: (this.product.minOrderQuantity + index).toString(),
        } as SelectOption)
    );
  }
}
