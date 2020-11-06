import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-dynamic',
  templateUrl: './select-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: component-creation-test
export class SelectDynamicComponent extends FieldType {
  castControlName(val: unknown) {
    return val as string;
  }

  castErrorMessages(val: unknown) {
    return val as { [key: string]: string };
  }

  castOptions(val: unknown) {
    return val as SelectOption[];
  }
}
