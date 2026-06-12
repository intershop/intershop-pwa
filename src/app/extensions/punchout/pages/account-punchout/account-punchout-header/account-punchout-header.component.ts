import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutType } from '../../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-header',
  templateUrl: './account-punchout-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutHeaderComponent {
  @Input({ required: true }) selectedType: PunchoutType;
  @Input() punchoutTypes: PunchoutType[];
  @Input() error: HttpError;
}
