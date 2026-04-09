import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'ish-cost-center-buyers-repeat-field',
  templateUrl: './cost-center-buyers-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyField],
})
export class CostCenterBuyersRepeatFieldComponent extends FieldArrayType {}
