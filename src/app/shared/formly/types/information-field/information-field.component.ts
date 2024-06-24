import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Include any freestyle text within a Formly generated form (HTML content is supported).
 * Provide text via `localizationKey` or just plain `text` and adapt the styling via `containerClass`.
 */
@Component({
  selector: 'ish-information-field',
  templateUrl: './information-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationFieldComponent extends FieldType<FieldTypeConfig> {}
