import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-user-budget-form',
  templateUrl: './user-budget-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserBudgetFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;

  currentLocale$: Observable<Locale>;
  periods = ['weekly', 'monthly', 'quarterly'];
  currency = 'USD'; // fallback currency

  private destroy$ = new Subject();

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.init();
  }

  init() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for UserBudgetFormComponent');
    }

    if (!this.formControlBudget) {
      throw new Error(`control 'budget' does not exist in the given form for UserBudgetFormComponent`);
    }

    this.currentLocale$ = this.appFacade.currentLocale$;

    // if there is no predefined currency determine currency from default locale
    if (!this.form.get('currency').value) {
      this.currentLocale$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locale => {
        if (locale.currency) {
          this.form.get('currency').setValue(locale.currency);
          this.form.updateValueAndValidity();
        }
      });
    }
    this.currency = this.form.get('currency').value;
  }

  get formControlBudget(): AbstractControl {
    return this.form && this.form.get('budget');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
