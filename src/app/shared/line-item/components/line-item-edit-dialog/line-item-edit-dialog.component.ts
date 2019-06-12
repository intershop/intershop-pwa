import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { SpecialValidators } from '../../../forms/validators/special-validators';

@Component({
  selector: 'ish-line-item-edit-dialog',
  templateUrl: './line-item-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditDialogComponent implements OnInit, OnDestroy {
  @Input() lineItem: LineItemView;
  @Input() variation$: Observable<VariationProductView>;
  @Input() variationOptions$: Observable<VariationOptionGroup[]>;
  @Input() loading$: Observable<boolean>;
  @Input() editable = true;

  @Output() selectVariation = new EventEmitter<VariationSelection>();
  @Output() selectQuantity = new EventEmitter<LineItemUpdate>();

  form: FormGroup;
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.initQuantityForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  variationSelected(selection: VariationSelection) {
    this.selectVariation.emit(selection);
  }

  private initQuantityForm() {
    if (this.lineItem && this.lineItem.product) {
      // quantity-form
      this.form = new FormGroup({
        items: new FormArray([this.createItemForm()]),
      });
    }
  }

  /**
   * Returns a formgroup (itemId and quantity) according to the given line item.
   * @returns         A formgroup.
   */
  private createItemForm(): FormGroup {
    if (this.lineItem && this.lineItem.product) {
      const formGroup = this.formBuilder.group({
        itemId: this.lineItem.id,
        quantity: [
          this.lineItem.quantity.value,
          [Validators.required, Validators.max(this.lineItem.product.maxOrderQuantity), SpecialValidators.integer],
        ],
      });

      // Subscribe on form value changes
      formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((item: LineItemUpdate) => {
        if (formGroup.valid) {
          this.selectQuantity.emit({ ...item, quantity: +item.quantity });
        }
      });

      return formGroup;
    }
  }
}
