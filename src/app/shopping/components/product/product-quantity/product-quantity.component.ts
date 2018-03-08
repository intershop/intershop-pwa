import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Product } from '../../../../models/product/product.model';
import { SelectOption } from '../../../../shared/components/form-controls/select';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductQuantityComponent implements OnInit {
  @Input() product: Product;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() type?: string;
  @Input() class?: string;

  readonly selectType = 'select';
  isTypeSelect: boolean;
  // TODO: to be removed when REST response is available for max quantity
  maxOrderQuantityOptions = 10;

  ngOnInit() {
    this.parentForm.addControl(this.controlName,
      new FormControl(this.product.minOrderQuantity, this.getValidations()));
  }

  getValidations(): ValidatorFn {
    if (this.type !== this.selectType) {
      return Validators.compose([Validators.required,
      Validators.min(this.product.minOrderQuantity), Validators.pattern('^[0-9]*')]);
    }
  }

  get quantityOptions(): SelectOption[] {
    return Array.from({ length: this.maxOrderQuantityOptions },
      (v, k) => ({
        label: (this.product.minOrderQuantity + k).toString(),
        value: (this.product.minOrderQuantity + k).toString()
      } as SelectOption));
  }
}
