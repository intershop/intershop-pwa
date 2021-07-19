import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldWrapper } from '@ngx-formly/core';
import { isEqual } from 'lodash-es';
import { Subject, noop } from 'rxjs';
import { pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

import { log } from 'ish-core/utils/dev/operators';

@Component({
  selector: 'ish-radio-button-fieldgroup-wrapper',
  templateUrl: './radio-button-fieldgroup-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonFieldgroupWrapperComponent extends FieldWrapper implements OnInit, OnDestroy {
  radioFormControl: FormControl;

  constructor() {
    super();
  }

  destroy$ = new Subject();
  disabled$ = new Subject();

  // TODO: TEST USING A SEPERATE KEY AND EN/DISABLING USING AVALUECHANGES TYPE THING
  ngOnInit() {
    // this.form.valueChanges.pipe(log('vc')).subscribe();
    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        pairwise(),
        tap(([prev, cur]) => (isEqual(prev, cur) ? this.disabled$.next(true) : noop())),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.radioFormControl = new FormControl();

    this.disabled$.pipe(log('disabled')).subscribe();

    this.field = {
      ...this.field,
      fieldGroup: this.field.fieldGroup.map(field => ({
        ...field,
        expressionProperties: {
          ...field.expressionProperties,
          'templateOptions.disabled': this.disabled$,
        },
      })),
    };
  }

  get fc() {
    return this.formControl as FormControl;
  }

  change() {
    this.disabled$.next(false);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
