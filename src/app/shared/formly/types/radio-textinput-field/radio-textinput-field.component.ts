import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ish-radio-textinput-field',
  templateUrl: './radio-textinput-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RadioTextinputFieldComponent extends FieldType implements OnInit, OnDestroy {
  constructor(private cd: ChangeDetectorRef, private formlyConfig: FormlyConfig) {
    super();
  }

  private destroy$ = new Subject();

  textFormControl = new FormControl();
  textField: FormlyFieldConfig;

  get fc() {
    return this.formControl as FormControl;
  }

  get se() {
    return this.formlyConfig.extras.showError(this.textField as FieldType);
  }

  ngOnInit() {
    this.textField = {
      ...this.to.textConfig,
      formControl: this.textFormControl,
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
