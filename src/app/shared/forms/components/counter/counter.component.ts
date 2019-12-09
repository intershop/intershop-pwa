import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';

@Component({
  selector: 'ish-counter',
  templateUrl: './counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent extends FormElementComponent implements OnInit, OnDestroy, OnChanges {
  @Input() min: number;
  @Input() max: number;

  value$ = new ReplaySubject<number>(1);
  cannotDecrease$: Observable<boolean>;
  cannotIncrease$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private get value(): number {
    return +this.formControl.value;
  }

  ngOnChanges() {
    this.value$.next(this.value);
  }

  ngOnInit() {
    super.init();

    this.cannotDecrease$ = this.value$.pipe(map(value => this.min !== undefined && value <= this.min));
    this.cannotIncrease$ = this.value$.pipe(map(value => this.max !== undefined && value >= this.max));

    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.value$);
  }

  increase() {
    (this.formControl as FormControl).setValue(this.value + 1, { emitEvent: true });
  }

  decrease() {
    (this.formControl as FormControl).setValue(this.value - 1, { emitEvent: true });
  }

  get displayLabel(): boolean {
    return !!this.label && !!this.label.trim();
  }
}
