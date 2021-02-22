import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-horizontal-wrapper',
  template: `
    <div class="form-group row" [class.formly-has-error]="showError" [attr.data-testing-id]="keyString + '-wrapper'">
      <label
        [attr.for]="id"
        class="col-form-label"
        [ngClass]="to.labelClass ? to.labelClass : dto.labelClass"
        *ngIf="to.label"
      >
        {{ to.label | translate }}
        <span class="formly-required-star" *ngIf="to.required">*</span>
      </label>
      <div [ngClass]="to.fieldClass ? to.fieldClass : dto.fieldClass">
        <ng-template #fieldComponent></ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalWrapperComponent extends FieldWrapper {
  dto = {
    labelClass: 'col-md-5',
    fieldClass: 'col-md-7',
  };
  get keyString() {
    return this.field.key as string;
  }
}
