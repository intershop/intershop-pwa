import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-input-dynamic',
  templateUrl: './input-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: component-creation-test
export class InputDynamicComponent extends FieldType {
  castControlName(val: unknown) {
    return val as string;
  }

  castErrorMessages(val: unknown) {
    return val as { [key: string]: string };
  }
}
