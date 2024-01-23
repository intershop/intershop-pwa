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

import { AccountFacade } from 'ish-core/facades/account.facade';
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
  @Output() quantityUpdated = new EventEmitter<number>();

  private destroyRef = inject(DestroyRef);
  isB2C = false;

  constructor(private returnRequestFacade: ReturnRequestFacade, private accountFacade: AccountFacade) {}

  totalQuantity = 0;
  columnsToDisplay = ['select', 'product', 'returnable_qty', 'qty'];

  ngOnInit(): void {
    this.generateFormGroup();
    this.accountFacade.isBusinessCustomer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isBusinessCustomer => {
      if (isBusinessCustomer !== undefined && !false) {
        this.isB2C = true;
        this.columnsToDisplay = [...this.columnsToDisplay, 'reason'];
      }
    });

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
        if (this.isB2C) {
          this.updateStatusAndValidity(`${sku}.reason`, isChecked);
        }
      });
    });

    this.itemsForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items: FormItems) => {
      if (this.isItemformHasValidRow()) {
        this.updatePositions(items);
      }
      if (this.itemsCheckState().every(item => !item)) {
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
          qty: new FormControl({ value: '1', disabled: true }),
          reason: new FormControl({ value: undefined, disabled: true }),
        })
      );
    });
  }

  updatePositions(items: FormItems) {
    this.totalQuantity = 0;
    const positionItems = Object.keys(items)
      .filter(itemKey => this.itemsForm.value[itemKey].checked)
      .map(itemKey => {
        this.totalQuantity += parseInt(this.itemsForm.value[itemKey].qty ?? 0, 10);
        let reason;
        if (this.isB2C) {
          reason = this.itemsForm.value[itemKey].reason;
        }
        return {
          positionNumber: this.returnableItems.find(pos => pos.sku === itemKey).positionNumber,
          productNumber: itemKey,
          quantity: this.itemsForm.value[itemKey].qty,
          reason,
        };
      });

    this.itemsUpdated.emit(positionItems);
    this.quantityUpdated.emit(this.totalQuantity);
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
      key =>
        this.itemsForm.value[key].checked &&
        this.itemsForm.value[key].qty &&
        (!this.isB2C || (this.isB2C && this.itemsForm.value[key].reason))
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
    if (this.isB2C) {
      this.updateStatusAndValidity(`${sku}.reason`, isChecked);
    }
  }
}
