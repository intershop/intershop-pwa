import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-formly-fieldgroup-example',
  templateUrl: './formly-testing-fieldgroup-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingFieldgroupExampleComponent extends FieldType {}
