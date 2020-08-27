import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GroupFormComponent {
  @Input() form: FormGroup;
  @Input() error: HttpError;
}
