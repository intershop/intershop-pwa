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
  @Input() product: Product;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() type?: string;
  @Input() class?: string;

  readonly selectType = 'select';

  minOrderQuantity = 1;
  maxOrderQuantity = 100;

  ngOnInit() {
    if (this.product.minOrderQuantity) {
      this.minOrderQuantity = this.product.minOrderQuantity;
    }
    if (this.product.maxOrderQuantity) {
      this.maxOrderQuantity = this.product.maxOrderQuantity;
    }
    this.parentForm.get(this.controlName).setValidators(this.getValidations());
  }

  getValidations(): ValidatorFn {
    if (this.type !== this.selectType) {
      return Validators.compose([
        Validators.required,
        Validators.min(this.minOrderQuantity),
        Validators.max(this.maxOrderQuantity),
        SpecialValidators.integer,
      ]);
    }
  }

  get quantityOptions(): SelectOption[] {
    return Array.from(
      { length: this.maxOrderQuantity - this.minOrderQuantity + 1 },
      (value, index) =>
        ({
          label: (this.minOrderQuantity + index).toString(),
          value: (this.minOrderQuantity + index).toString(),
        } as SelectOption)
    );
  }
}
