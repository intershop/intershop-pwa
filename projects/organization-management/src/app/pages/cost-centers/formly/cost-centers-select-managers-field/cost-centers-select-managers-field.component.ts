import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render manager select box, specific for the cost centers page.
 */
@Component({
  selector: 'ish-cost-centers-select-managers-field',
  templateUrl: './cost-centers-select-managers-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCentersSelectManagersFieldComponent extends FieldType<FieldTypeConfig> {}
