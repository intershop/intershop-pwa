import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-select-dynamic',
  templateUrl: './select-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDynamicComponent extends FieldType {}
