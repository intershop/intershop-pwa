import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-validation-icons',
  templateUrl: './validation-icons.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationIconsComponent {
  @Input() field: FormlyFieldConfig;
  @Input() showError: boolean;
}
