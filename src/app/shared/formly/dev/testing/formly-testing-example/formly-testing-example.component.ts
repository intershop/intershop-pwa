import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'ish-formly-testing-example',
  imports: [FormlyModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './formly-testing-example.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
export class FormlyTestingExampleComponent extends FieldType {}
