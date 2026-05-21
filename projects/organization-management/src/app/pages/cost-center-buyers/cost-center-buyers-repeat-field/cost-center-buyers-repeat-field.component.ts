import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-cost-center-buyers-repeat-field',
  standalone: false,
  templateUrl: './cost-center-buyers-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterBuyersRepeatFieldComponent extends FieldArrayType {}
