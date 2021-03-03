import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, isObservable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ish-validation-message',
  template: '<small>{{ errorMessage$ | async | translate }} </small>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessageComponent implements OnChanges {
  @Input() field: FormlyFieldConfig;
  errorMessage$: Observable<string>;

  constructor(private config: FormlyConfig) {}

  ngOnChanges() {
    this.errorMessage$ = this.field.formControl.statusChanges.pipe(
      startWith(false),
      switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage)))
    );
  }

  get errorMessage() {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message = this.config.getValidatorMessage(error);

        if (fieldForm.errors[error] !== null && typeof fieldForm.errors[error] === 'object') {
          if (fieldForm.errors[error].errorPath) {
            return;
          }

          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (this.field.validation && this.field.validation.messages && this.field.validation.messages[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators && this.field.validators[error] && this.field.validators[error].message) {
          message = this.field.validators[error].message;
        }

        if (
          this.field.asyncValidators &&
          this.field.asyncValidators[error] &&
          this.field.asyncValidators[error].message
        ) {
          message = this.field.asyncValidators[error].message;
        }

        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }

        return message;
      }
    }
  }
}
