import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { Observable, Subject, isObservable, of } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface TemplateOptions {
  options: Observable<{ value: string; label: string }[]> | { value: string; label: string }[];
  newInput?: { formControl: FormControl; label: string };
}

@Component({
  selector: 'ish-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonsFieldComponent extends FieldType implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  ngOnInit() {
    const templOpts = this.to as TemplateOptions;
    templOpts.newInput?.formControl.setValue(templOpts.newInput.label);

    // pre-select first value and make sure new field is disabled from the start
    this.entries.pipe(take(1), takeUntil(this.destroy$)).subscribe(entries => {
      this.formControl.setValue(entries[0].value);
      templOpts.newInput?.formControl.disable({ emitEvent: false });
    });

    // disable new field if not selected
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ =>
        this.formControl.value === 'new'
          ? templOpts.newInput?.formControl.enable({ emitEvent: false })
          : templOpts.newInput?.formControl.disable({ emitEvent: false })
      );
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
