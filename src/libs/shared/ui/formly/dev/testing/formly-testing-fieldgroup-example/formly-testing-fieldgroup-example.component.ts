import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-formly-fieldgroup-example',
  templateUrl: './formly-testing-fieldgroup-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingFieldgroupExampleComponent extends FieldType {}
