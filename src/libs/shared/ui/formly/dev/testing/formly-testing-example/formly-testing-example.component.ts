import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-formly-testing-example',
  templateUrl: './formly-testing-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingExampleComponent extends FieldType {}
