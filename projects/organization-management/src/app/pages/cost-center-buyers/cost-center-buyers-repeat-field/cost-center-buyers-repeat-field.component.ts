import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'ish-cost-center-buyers-repeat-field',
  imports: [FormlyField],
  standalone: true,
  templateUrl: './cost-center-buyers-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterBuyersRepeatFieldComponent extends FieldArrayType {}
