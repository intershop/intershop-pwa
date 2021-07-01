import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-radio-horizontal-wrapper',
  templateUrl: './radio-horizontal-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioHorizontalWrapperComponent extends FieldWrapper {}
