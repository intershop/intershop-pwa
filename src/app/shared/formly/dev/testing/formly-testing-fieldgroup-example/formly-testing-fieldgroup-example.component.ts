import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'ish-formly-fieldgroup-example',
  imports: [FormlyModule],
  standalone: true,
  templateUrl: './formly-testing-fieldgroup-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
export class FormlyTestingFieldgroupExampleComponent extends FieldType {}
