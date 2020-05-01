import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-checkbox-dynamic',
  templateUrl: './checkbox-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: component-creation-test
export class CheckboxDynamicComponent extends FieldType {}
