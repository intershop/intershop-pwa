import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, isObservable, of } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

interface TemplateOptions {
  options: Observable<{ value: string; label: string }[]> | { value: string; label: string }[];
  newInput?: { formGroup: FormGroup; config: FormlyFieldConfig[] };
}

@Component({
  selector: 'ish-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonsFieldComponent extends FieldType implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  newInputConfig: FormlyFieldConfig[];

  constructor() {
    super();
  }

  ngOnInit() {
    const templOpts = this.to as TemplateOptions;

    this.newInputConfig = templOpts.newInput?.config.map(fieldConfig => ({
      ...fieldConfig,
      expressionProperties: {
        ...fieldConfig.expressionProperties,
        'templateOptions.disabled': this.formControl.valueChanges.pipe(
          startWith(''),
          map(value => value !== 'new'),
          takeUntil(this.destroy$)
        ),
      },
    }));
  }

  // helpers for type safety in the template

  get entries(): Observable<{ value: string; label: string }[]> {
    return isObservable(this.to.options) ? this.to.options : of(this.to.options);
  }

  get fc(): FormControl {
    return this.formControl as FormControl;
  }

  get k(): string {
    return this.field.key as string;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
