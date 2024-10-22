import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render radio buttons for budget types
 */
@Component({
  selector: 'ish-budget-type-field',
  templateUrl: './budget-type-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTypeFieldComponent extends FieldType<FieldTypeConfig> {
  get radioName() {
    return `${this.field.parent?.id || ''}${this.field.key}`;
  }
}
