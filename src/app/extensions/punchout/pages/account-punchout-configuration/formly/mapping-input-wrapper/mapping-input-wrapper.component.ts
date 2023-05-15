import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * The wrapper for displaying two input fields, a map from and a map to field.
 *
 */
@Component({
  selector: 'ish-mapping-input-wrapper',
  templateUrl: './mapping-input-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappingInputWrapperComponent extends FieldWrapper {}
