import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-formly-fieldgroup-example',
  standalone: false,
  templateUrl: './formly-testing-fieldgroup-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
export class FormlyTestingFieldgroupExampleComponent extends FieldType {}
