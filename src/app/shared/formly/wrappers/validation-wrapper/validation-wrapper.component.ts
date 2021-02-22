import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-validation-wrapper',
  template: `
    <ng-template #fieldComponent></ng-template>
    <ish-validation-icons
      [field]="field"
      [showError]="showError"
      [ngClass]="field.type === 'ish-select-field' ? 'validation-offset' : ''"
    ></ish-validation-icons>
    <ng-container *ngIf="showError" class="invalid-feedback d-block">
      <ish-validation-message [field]="field" class="validation-message"></ish-validation-message>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationWrapperComponent extends FieldWrapper {}
