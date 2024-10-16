import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { range } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  @Input() type: 'input' | 'select' | 'counter' = 'counter';
  @Input() elementId: string = uuid();

  visible$: Observable<boolean>;
  quantity$: Observable<number>;
  min$: Observable<number>;
  max$: Observable<number>;
  step$: Observable<number>;
  hasQuantityError$: Observable<boolean>;
  quantityError$: Observable<string>;

  selectValues$: Observable<number[]>;

  cannotIncrease$: Observable<boolean>;
  cannotDecrease$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'quantity');
    this.quantity$ = this.context.select('quantity').pipe(filter(n => typeof n === 'number' && !isNaN(n)));
    this.min$ = this.context.select('minQuantity');
    this.max$ = this.context.select('maxQuantity');
    this.step$ = this.context.select('stepQuantity');
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.quantityError$ = this.context.select('quantityError');

    this.selectValues$ = combineLatest([this.min$, this.max$, this.step$]).pipe(
      map(([min, max, step]) => range(min, max + 1, step))
    );

    this.cannotIncrease$ = combineLatest([this.max$, this.quantity$]).pipe(map(([max, quantity]) => quantity >= max));
    this.cannotDecrease$ = combineLatest([this.min$, this.quantity$]).pipe(map(([min, quantity]) => quantity <= min));
  }

  private setValue(value: number) {
    this.context.set('quantity', () => value);
  }

  private setNextValue(value: number) {
    const max = this.context.get('maxQuantity');
    const min = this.context.get('minQuantity');
    const step = this.context.get('stepQuantity');
    this.setValue(value > max ? max : value < min ? min : value - (value % step));
  }

  increase() {
    this.setNextValue(this.context.get('quantity') + this.context.get('stepQuantity'));
  }

  decrease() {
    this.setNextValue(this.context.get('quantity') - this.context.get('stepQuantity'));
  }

  change(target: EventTarget) {
    this.setValue(Number.parseInt((target as HTMLDataElement).value, 10));
  }

  get ariaDescribedByIds(): string | null {
    let hasQuantityError: boolean;
    this.hasQuantityError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => (hasQuantityError = value));
    return ariaDescribedByIds(this.elementId, hasQuantityError);
  }
}
