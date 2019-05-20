import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-input-dynamic',
  templateUrl: './input-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InputDynamicComponent extends FieldType {}
