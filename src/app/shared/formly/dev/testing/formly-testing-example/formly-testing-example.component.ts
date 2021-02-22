import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-formly-testing-example',
  templateUrl: './formly-testing-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingExampleComponent extends FieldType {}
