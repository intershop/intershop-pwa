import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

import { ReturnRequestFacade } from '../../facades/return-request.facade';
import { CreateReturnRequestPosition, ReturnablePosition } from '../../models/return-request/return-request.model';

interface FormItems {
  [key: string]: { checked: boolean; qty: number; reason: 'string' };
}

@Component({
  selector: 'ish-returnable-items',
  templateUrl: './returnable-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnableItemsComponent implements OnInit {
  @Input() returnableItems: ReturnablePosition[] = [];
  @Input() form: UntypedFormGroup;

  returnReasons: SelectOption[] = [];
  @Output() itemsUpdated = new EventEmitter<CreateReturnRequestPosition[]>();

  private destroyRef = inject(DestroyRef);

  constructor(private returnRequestFacade: ReturnRequestFacade) {}

  columnsToDisplay = ['select', 'product', 'returnable_qty', 'qty', 'reason'];

  ngOnInit(): void {
    this.generateFormGroup();

    this.returnRequestFacade
      .getReturnReasons$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reasons => {
        if (reasons?.length) {
          this.returnReasons = reasons;
        }
      });

    this.checkAll.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isChecked => {
      this.returnableItems.forEach(({ sku, maxReturnQty }) => {
        this.getControl(sku, 'checked').setValue(isChecked);
        this.updateStatusAndValidity(`${sku}.qty`, isChecked, maxReturnQty);
        this.updateStatusAndValidity(`${sku}.reason`, isChecked);
      });
    });

    this.itemsForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items: FormItems) => {
      if (this.isItemformHasValidRow()) {
        this.updatePositions(items);
      }
    });
  }

  generateFormGroup() {
    this.returnableItems.forEach(d => {
      this.itemsForm.addControl(
        d.sku,
        new FormGroup({
          checked: new FormControl(false),
          qty: new FormControl({ value: '', disabled: true }),
          reason: new FormControl({ value: '', disabled: true }),
        })
      );
    });
  }

  updatePositions(items: FormItems) {
    const positionItems = Object.keys(items)
      .filter(itemKey => this.itemsForm.value[itemKey].checked)
      .map(itemKey => ({
        positionNumber: this.returnableItems.find(pos => pos.sku === itemKey).positionNumber,
        productNumber: itemKey,
        reason: this.itemsForm.value[itemKey].reason,
        quantity: this.itemsForm.value[itemKey].qty,
      }));

    this.itemsUpdated.emit(positionItems);
  }

  get itemsForm() {
    return this.form.get('items') as FormGroup;
  }

  get checkAll() {
    return this.form.get('checkAll') as FormControl;
  }

  getControl(sku: string, control: string) {
    return this.itemsForm.get(`${sku}.${control}`);
  }

  updateStatusAndValidity(controlName: string, isChecked: boolean, maxQuantiy?: number) {
    this.itemsForm.get(controlName)[isChecked ? 'enable' : 'disable']();
    const validators = maxQuantiy ? [Validators.required, Validators.max(maxQuantiy)] : [Validators.required];
    this.itemsForm.get(controlName)[isChecked ? 'setValidators' : 'removeValidators'](validators);
    this.itemsForm.get(controlName).updateValueAndValidity();
  }

  itemsCheckState(): boolean[] {
    return Object.keys(this.itemsForm.value).map(key => this.itemsForm.value[key].checked);
  }

  isItemformHasValidRow(): boolean {
    return !!Object.keys(this.itemsForm.value).filter(
      key => this.itemsForm.value[key].checked && this.itemsForm.value[key].qty && this.itemsForm.value[key].reason
    ).length;
  }

  toggleFields(event: Event, sku: string, maxQuantiy: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // uncheck checkAll checkbox if any row is unselected
    if (this.itemsCheckState().some(check => !check)) {
      this.checkAll.setValue(false, { emitEvent: false });
    }

    // check checkAll checkbox if all rows are selected
    if (this.itemsCheckState().every(check => check)) {
      this.checkAll.setValue(true, { emitEvent: false });
    }

    this.updateStatusAndValidity(`${sku}.qty`, isChecked, maxQuantiy);
    this.updateStatusAndValidity(`${sku}.reason`, isChecked);
  }
}
