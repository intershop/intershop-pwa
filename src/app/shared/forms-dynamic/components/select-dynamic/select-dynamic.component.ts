import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-select-dynamic',
  templateUrl: './select-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectDynamicComponent extends FieldType {}
