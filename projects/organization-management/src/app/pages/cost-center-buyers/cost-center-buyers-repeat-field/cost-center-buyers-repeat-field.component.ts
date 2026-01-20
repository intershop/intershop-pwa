import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'ish-cost-center-buyers-repeat-field',
  templateUrl: './cost-center-buyers-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyModule, NgFor],
})
export class CostCenterBuyersRepeatFieldComponent extends FieldArrayType {}
