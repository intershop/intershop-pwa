import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, isObservable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { FormsService } from 'ish-shared/forms/utils/forms.service';

/**
 * Component that reads a fields validity status and displays active error messages.
 */
@Component({
  selector: 'ish-validation-message',
  template: '<small class="mt-1" id="{{ field.id }}-validation-error">{{ errorMessage$ | async | translate }} </small>',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationMessageComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) field: FormlyFieldConfig;
  @Input() id: string;
  errorMessage$: Observable<string>;

  constructor(private config: FormlyConfig) {}

  ngOnInit(): void {
    this.field.props = {
      ...this.field.props,
      ariaDescribedByIds: FormsService.addAriaDescribedById(
        this.field.props?.ariaDescribedByIds,
        `${this.field.id}-validation-error`
      ),
    };
  }

  ngOnDestroy(): void {
    this.field.props.ariaDescribedByIds = FormsService.removeAriaDescribedById(
      this.field.props.ariaDescribedByIds,
      `${this.field.id}-validation-error`
    );
  }

  ngOnChanges() {
    this.errorMessage$ = this.field.formControl.statusChanges.pipe(
      startWith(false),
      switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage)))
    );
  }

  get errorMessage(): string | Observable<string> {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        // eslint-disable-next-line unicorn/no-null
        if (fieldForm.errors[error] !== null && typeof fieldForm.errors[error] === 'object') {
          if (fieldForm.errors[error].errorPath) {
            return;
          }

          if (fieldForm.errors[error].message) {
            return fieldForm.errors[error].message;
          }
        }

        return this.determineErrorMessage(error);
      }
    }
  }

  private determineErrorMessage(error: string): string | Observable<string> {
    let message = this.config.getValidatorMessage(error);

    if (this.field.validation?.messages && this.field.validation.messages[error]) {
      message = this.field.validation.messages[error];
    }

    if (this.field.validators?.[error]?.message) {
      message = this.field.validators[error].message;
    }

    if (this.field.asyncValidators?.[error]?.message) {
      message = this.field.asyncValidators[error].message;
    }

    if (typeof message === 'function') {
      return message(this.field.formControl.errors[error], this.field);
    }

    return message;
  }
}
