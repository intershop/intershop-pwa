import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationWrapperComponent extends FieldWrapper {}
