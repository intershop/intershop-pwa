import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-input-addon-wrapper',
  templateUrl: './input-addon-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddonWrapperComponent extends FieldWrapper {}
