import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-quickorder-repeat-form-quantity',
  templateUrl: './quickorder-repeat-form-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderRepeatFormQuantityComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: SkuQuantityType;
  @Input() skuControl: AbstractControl;

  private destroy$ = new Subject();

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.context
      .select('quantity')
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        if (this.model.quantity !== quantity) {
          this.update(quantity);
        }
      });
    this.skuControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(control => {
      this.context.set('sku', () => (control.sku ? control.sku : ''));
      if (control.sku === '') {
        this.setContext();
      }
    });
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c.model) {
      this.setContext();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  update(quantity: number): void {
    this.model.quantity = quantity;
  }

  private setContext() {
    this.context.set('sku', () => '_');
    this.context.set('minQuantity', () => 1);
    this.context.set('maxQuantity', () => 100);
    this.context.set('stepQuantity', () => 1);
    this.context.set('hasQuantityError', () => false);
    this.context.set('quantity', () => 1);
  }
}
